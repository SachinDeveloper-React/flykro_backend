// src/services/ApiService.js

class ApiService {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  // Helper method for configuring fetch options
  async fetch(url, options) {
    try {
      const response = await fetch(`${this.baseURL}${url}`, options);
      return await this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  async handleResponse(response) {
    if (!response.ok) {
      // Custom error handling based on response status
      const errorData = await response.json();
      throw new Error(errorData.errors[0].title || "API request failed");
    }
    return response.json();
  }

  handleError(error) {
    console.error(`API Error: ${error.message}`);
    throw error;
  }

  get(url, headers, params = {}) {
    // Convert params object to query string
    const queryString = new URLSearchParams(params).toString();
    const urlWithParams = queryString ? `${url}?${queryString}` : url;

    return this.fetch(urlWithParams, {
      method: "GET",
      headers,
    });
  }

  post(url, headers, data) {
    return this.fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
  }

  put(url, headers, data) {
    return this.fetch(url, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });
  }

  delete(url, headers) {
    return this.fetch(url, {
      method: "DELETE",
      headers,
    });
  }
}

module.exports = ApiService;
