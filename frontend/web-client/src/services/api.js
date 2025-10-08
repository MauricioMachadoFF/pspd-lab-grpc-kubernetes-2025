import axios from 'axios';


const getEnv = (key, defaultValue) => {
  return window._env_?.[key] || process.env[key] || defaultValue;
};

// Cliente para o nosso novo gateway
const gatewayClient = axios.create({
  baseURL: getEnv('API_GATEWAY_URL', 'http://localhost:8000')
});

// Cliente direto para o serviço de analytics (não precisa de passar pelo gateway)
const analyticsClient = axios.create({
  baseURL: getEnv('REACT_APP_ANALYTICS', 'http://localhost:8081') ,
});

console.log(window._env_)
/**
 * Normaliza a resposta do Gateway para o formato que a UI espera.
 */
const normalizeResponse = (gatewayResponse, originalData) => {
    let finalData = {};

    // Normalização para URL Shortener
    if (gatewayResponse.data && gatewayResponse.data.shortUrl) { // REST
        finalData = gatewayResponse.data;
    } else if (gatewayResponse.shortUrl) { // gRPC
        finalData = { 
            shortUrl: gatewayResponse.shortUrl,
            originalUrl: originalData.url,
            shortCode: gatewayResponse.shortUrl.split('/').pop()
        };
    }
    // Normalização para QR Code
    else if (gatewayResponse.qrCode) { // REST
        finalData = { qrCode: gatewayResponse.qrCode };
    } else if (gatewayResponse.qrCodeBase64) { // gRPC
        finalData = { qrCode: gatewayResponse.qrCodeBase64 };
    }

    return {
        data: finalData,
        metrics: { duration: gatewayResponse.responseTime },
        status: 200
    };
};


class UrlShortenerAPI {
    constructor(protocol) { this.protocol = protocol; }
    async shortenURL(url) {
        const response = await gatewayClient.post('/url', { url }, {
            headers: { 'X-Protocol-Choice': this.protocol }
        });
        return normalizeResponse(response.data, { url });
    }
}

class QrCodeAPI {
    constructor(protocol) { this.protocol = protocol; }
    async generateQR(text) {
        const response = await gatewayClient.post('/qr', { text }, {
            headers: { 'X-Protocol-Choice': this.protocol }
        });
        return normalizeResponse(response.data, { text });
    }
}

class AnalyticsAPI {
    async getServiceHealth() {
        const response = await analyticsClient.get('/health-check/all');
        return response.data;
    }
}

export class APIFactory {
    static create(protocol) {
        return {
            urlShortener: new UrlShortenerAPI(protocol),
            qrGenerator: new QrCodeAPI(protocol),
            analytics: new AnalyticsAPI(),
        };
    }
}
