console.log("ajaxService");
// services/ajaxService.js

/**
 * A simplified alternative to $.ajax for background Service Workers using fetch API.
 * @param {object} options - Configuration object for the AJAX request.
 * @param {string} options.url - The URL to send the request to.
 * @param {string} [options.method='GET'] - The HTTP method (GET, POST, PUT, DELETE, PATCH).
 * @param {object|string|null} [options.data=null] - Data for POST/PUT/PATCH requests (will be JSON.stringified) or query params for GET.
 * @param {object} [options.headers={}] - Custom request headers.
 * @param {'json'|'text'} [options.dataType='json'] - Expected data type of the response ('json' or 'text').
 * @param {function} [options.success] - Callback function for success: (data, statusText, response) => void.
 * @param {function} [options.error] - Callback function for error: (xhr, statusText, errorThrown) => void.
 * @returns {Promise<any>} A promise that resolves with the response data or rejects with an error.
 */
export async function customAjax(options) {
  const {
    url,
    method = "GET",
    data = null,
    headers = {},
    dataType,
    success,
    error,
  } = options;

  let targetUrl = url;

  try {
    const fetchOptions = {
      method: method.toUpperCase(),
      headers: {
        // Default to JSON content type, but allow override
        "Content-Type": "application/json",
        ...headers,
      },
    };

    // Add body for methods that typically send data
    if (
      ["POST", "PUT", "PATCH"].includes(fetchOptions.method) &&
      data !== null
    ) {
      fetchOptions.body = JSON.stringify(data);
    } else if (fetchOptions.method === "GET" && data !== null) {
      // For GET, append data to URL as query parameters if provided
      const queryString = new URLSearchParams(data).toString();
      targetUrl = `${url}?${queryString}`;
    }

    const response = await fetch(targetUrl, fetchOptions);

    if (!response.ok) {
      // If response is not 2xx, throw an error
      const errorBody = await response.text();
      const err = new Error(
        `HTTP Error: ${response.status} ${response.statusText}`
      );
      err.status = response.status;
      err.statusText = response.statusText;
      err.responseText = errorBody;
      throw err;
    }

    let responseData;
    if (dataType === "json") {
      responseData = await response.json();
    } else if (dataType === "text") {
      responseData = await response.text();
    } else {
      // Fallback if dataType is unknown
      responseData = await response.text();
    }

    if (success && typeof success === "function") {
      success(responseData, response.statusText, response);
    }
    return responseData;
  } catch (err) {
    console.error("customAjax error:", err);
    if (error && typeof error === "function") {
      // Mimic $.ajax error signature (jqXHR, textStatus, errorThrown)
      // We pass a simplified error object, status text, and the error itself
      error(
        {
          status: err.status,
          statusText: err.statusText,
          responseText: err.responseText,
        },
        err.statusText || "error",
        err
      );
    }
    throw err;
  }
}
