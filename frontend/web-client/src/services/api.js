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
    // gRPC endpoints - using JSON transcoding (gRPC accessible via HTTP/REST)
    // Microservice A (Link Shortener) - Port 5001
    urlShortener: 'http://localhost:5001',
    // Microservice B (QR Generator) - Port 5003
    qrGenerator: 'http://localhost:5003',
    // REST services (no gRPC equivalent)
    userManagement: 'http://localhost:8080',
    analytics: 'http://localhost:8081'
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
    if (this.protocol === 'gRPC') {
      // gRPC Microservice A uses JSON transcoding
      // Proto: CreateLink(CreateLinkRequest) returns (CreateLinkReply)
      // HTTP annotation: POST /v1/links
      const response = await this.makeRequest('urlShortener', '/v1/links', {
        method: 'POST',
        data: { url }  // gRPC proto only expects 'url' field
      });

      // Transform gRPC response to match REST format
      return {
        ...response,
        data: {
          originalUrl: url,
          shortUrl: `http://localhost:5001/${response.data.shortUrl}`,
          shortCode: response.data.shortUrl,
          createdAt: new Date().toISOString()
        }
      };
    } else {
      // REST API format
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
  }

  async resolveURL(shortCode) {
    if (this.protocol === 'gRPC') {
      // gRPC Microservice A: GetUrl(GetUrlRequest) returns (GetUrlReply)
      // HTTP annotation: GET /{shortUrl}
      const response = await this.makeRequest('urlShortener', `/${shortCode}`, {
        method: 'GET'
      });

      // Transform gRPC response to match REST format
      return {
        ...response,
        data: {
          originalUrl: response.data.url,
          shortCode: shortCode
        }
      };
    } else {
      return await this.makeRequest('urlShortener', `/api/v1/url/${shortCode}?redirect=false`, {
        method: 'GET'
      });
    }
  }

  async getURLStats(shortCode) {
    if (this.protocol === 'gRPC') {
      // Stats not available in gRPC Microservice A - only basic operations
      throw new Error('URL statistics are only available in REST mode');
    }

    return await this.makeRequest('urlShortener', `/api/v1/url/${shortCode}/stats`, {
      method: 'GET'
    });
  }

  async bulkShortenURLs(urls, userId = null) {
    if (this.protocol === 'gRPC') {
      // Bulk operations not available in gRPC Microservice A
      throw new Error('Bulk URL shortening is only available in REST mode');
    }

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
    if (this.protocol === 'gRPC') {
      // List operations not available in gRPC Microservice A
      throw new Error('URL listing is only available in REST mode');
    }

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
    if (this.protocol === 'gRPC') {
      // Delete operations not available in gRPC Microservice A
      throw new Error('URL deletion is only available in REST mode');
    }

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
    if (this.protocol === 'gRPC') {
      // gRPC Microservice B: CreateQR(CreateQRRequest) returns (CreateQRReply)
      // HTTP annotation: POST /v1/qrcode/encode
      const response = await this.makeRequest('qrGenerator', '/v1/qrcode/encode', {
        method: 'POST',
        data: { url: data }  // gRPC proto expects 'url' field
      });

      // Transform gRPC response to match REST format
      return {
        ...response,
        data: {
          id: `grpc-${Date.now()}`,
          data: data,
          format: 'PNG',
          qrCode: response.data.qrCodeBase64,
          size: size,
          errorCorrection: errorCorrection,
          createdAt: new Date().toISOString()
        }
      };
    } else {
      // REST API format
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
  }

  async generateQRBatch(qrRequests) {
    if (this.protocol === 'gRPC') {
      // Batch operations not available in gRPC Microservice B
      throw new Error('Batch QR generation is only available in REST mode');
    }

    return await this.makeRequest('qrGenerator', '/api/v1/qr/batch', {
      method: 'POST',
      data: { requests: qrRequests }
    });
  }

  async getQR(id) {
    if (this.protocol === 'gRPC') {
      // Get operations not available in gRPC Microservice B
      throw new Error('QR retrieval is only available in REST mode');
    }

    return await this.makeRequest('qrGenerator', `/api/v1/qr/${id}`, {
      method: 'GET'
    });
  }

  async listQRs(page = 1, size = 10) {
    if (this.protocol === 'gRPC') {
      // List operations not available in gRPC Microservice B
      throw new Error('QR listing is only available in REST mode');
    }

    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString()
    });

    return await this.makeRequest('qrGenerator', `/api/v1/qr?${params}`, {
      method: 'GET'
    });
  }

  async deleteQR(id) {
    if (this.protocol === 'gRPC') {
      // Delete operations not available in gRPC Microservice B
      throw new Error('QR deletion is only available in REST mode');
    }

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