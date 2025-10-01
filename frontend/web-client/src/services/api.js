import axios from 'axios';

// API Configuration
const API_CONFIG = {
  REST: {
    urlShortener: 'http://localhost:8083',
    qrGenerator: 'http://localhost:8082',
    userManagement: 'http://localhost:8080',
    analytics: 'http://localhost:8081'
  },
  gRPC: {
    // gRPC endpoints - will be implemented via REST gateway or direct gRPC-web
    urlShortener: 'http://localhost:9093',
    qrGenerator: 'http://localhost:9092',
    userManagement: 'http://localhost:9090',
    analytics: 'http://localhost:9091'
  }
};

// Performance tracking utility
class PerformanceTracker {
  static startTimer() {
    return {
      start: performance.now(),
      memory: performance.memory?.usedJSHeapSize || 0
    };
  }

  static endTimer(timer) {
    const end = performance.now();
    const memoryEnd = performance.memory?.usedJSHeapSize || 0;

    return {
      duration: end - timer.start,
      memoryDelta: memoryEnd - timer.memory,
      timestamp: new Date().toISOString()
    };
  }
}

// Base API class
class BaseAPI {
  constructor(protocol) {
    this.protocol = protocol;
    this.baseURLs = API_CONFIG[protocol];
    this.metrics = [];
  }

  async makeRequest(service, endpoint, options = {}) {
    const timer = PerformanceTracker.startTimer();
    const url = `${this.baseURLs[service]}${endpoint}`;

    try {
      const axiosConfig = {
        url,
        timeout: 10000,
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      };

      const response = await axios(axiosConfig);
      const metrics = PerformanceTracker.endTimer(timer);

      // Store metrics for comparison
      this.metrics.push({
        service,
        endpoint,
        protocol: this.protocol,
        metrics: {
          ...metrics,
          status: response.status,
          dataSize: JSON.stringify(response.data).length
        }
      });

      return {
        data: response.data.data || response.data, // Extract nested data if present
        metrics,
        status: response.status,
        message: response.data.message
      };

    } catch (error) {
      const metrics = PerformanceTracker.endTimer(timer);

      this.metrics.push({
        service,
        endpoint,
        protocol: this.protocol,
        metrics: {
          ...metrics,
          status: error.response?.status || 0,
          error: error.message
        }
      });

      throw {
        ...error,
        metrics
      };
    }
  }

  getMetrics() {
    return this.metrics;
  }

  clearMetrics() {
    this.metrics = [];
  }
}

// URL Shortener API
export class URLShortenerAPI extends BaseAPI {
  constructor(protocol) {
    super(protocol);
  }

  async shortenURL(url, customCode = null, userId = null) {
    const payload = {
      url,
      ...(customCode && { customCode }),
      ...(userId && { userId })
    };

    return await this.makeRequest('urlShortener', '/api/v1/url/shorten', {
      method: 'POST',
      data: payload
    });
  }

  async resolveURL(shortCode) {
    return await this.makeRequest('urlShortener', `/api/v1/url/${shortCode}?redirect=false`, {
      method: 'GET'
    });
  }

  async getURLStats(shortCode) {
    return await this.makeRequest('urlShortener', `/api/v1/url/${shortCode}/stats`, {
      method: 'GET'
    });
  }

  async bulkShortenURLs(urls, userId = null) {
    const payload = {
      urls,
      ...(userId && { userId })
    };

    return await this.makeRequest('urlShortener', '/api/v1/url/bulk', {
      method: 'POST',
      data: payload
    });
  }

  async listURLs(page = 1, size = 10, userId = null) {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      ...(userId && { userId })
    });

    return await this.makeRequest('urlShortener', `/api/v1/url?${params}`, {
      method: 'GET'
    });
  }

  async deleteURL(shortCode) {
    return await this.makeRequest('urlShortener', `/api/v1/url/${shortCode}`, {
      method: 'DELETE'
    });
  }
}

// QR Generator API
export class QRGeneratorAPI extends BaseAPI {
  constructor(protocol) {
    super(protocol);
  }

  async generateQR(data, format = 'PNG', size = 256, errorCorrection = 'MEDIUM') {
    const payload = {
      data,
      format,
      size,
      errorCorrection
    };

    return await this.makeRequest('qrGenerator', '/api/v1/qr/generate', {
      method: 'POST',
      data: payload
    });
  }

  async generateQRBatch(qrRequests) {
    return await this.makeRequest('qrGenerator', '/api/v1/qr/batch', {
      method: 'POST',
      data: { requests: qrRequests }
    });
  }

  async getQR(id) {
    return await this.makeRequest('qrGenerator', `/api/v1/qr/${id}`, {
      method: 'GET'
    });
  }

  async listQRs(page = 1, size = 10) {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString()
    });

    return await this.makeRequest('qrGenerator', `/api/v1/qr?${params}`, {
      method: 'GET'
    });
  }

  async deleteQR(id) {
    return await this.makeRequest('qrGenerator', `/api/v1/qr/${id}`, {
      method: 'DELETE'
    });
  }
}

// Analytics API
export class AnalyticsAPI extends BaseAPI {
  constructor(protocol) {
    super(protocol);
  }

  async getServiceHealth() {
    const results = {};

    for (const [service, baseUrl] of Object.entries(this.baseURLs)) {
      try {
        const response = await this.makeRequest(service, '/health', {
          method: 'GET'
        });
        results[service] = response.data;
      } catch (error) {
        results[service] = { status: 'ERROR', error: error.message };
      }
    }

    return results;
  }

  async getPerformanceMetrics() {
    // Return collected metrics from all API calls
    return {
      protocol: this.protocol,
      metrics: this.getMetrics(),
      summary: this.getMetricsSummary()
    };
  }

  getMetricsSummary() {
    const metrics = this.getMetrics();

    if (metrics.length === 0) return null;

    const avgDuration = metrics.reduce((sum, m) => sum + m.metrics.duration, 0) / metrics.length;
    const totalRequests = metrics.length;
    const successRate = metrics.filter(m => m.metrics.status >= 200 && m.metrics.status < 300).length / totalRequests * 100;

    return {
      averageResponseTime: avgDuration,
      totalRequests,
      successRate,
      protocol: this.protocol
    };
  }
}

// API Factory
export class APIFactory {
  static create(protocol) {
    return {
      urlShortener: new URLShortenerAPI(protocol),
      qrGenerator: new QRGeneratorAPI(protocol),
      analytics: new AnalyticsAPI(protocol)
    };
  }
}

export default APIFactory;