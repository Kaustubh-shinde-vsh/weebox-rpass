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
  const fetchMethod = method.toUpperCase();

  const contentType =
    headers["Content-Type"] || "application/x-www-form-urlencoded";

  const fetchHeaders = {
    ...headers,
    ...(headers["Content-Type"] ? {} : { "Content-Type": contentType }),
  };

  const fetchOptions = {
    method: fetchMethod,
    headers: fetchHeaders,
  };

  try {
    if (["POST", "PUT", "PATCH"].includes(fetchMethod) && data !== null) {
      if (contentType.includes("application/json")) {
        fetchOptions.body = data;
      } else if (contentType.includes("application/x-www-form-urlencoded")) {
        fetchOptions.body = new URLSearchParams(data).toString();
      } else {
        fetchOptions.body = data;
      }
    } else if (fetchMethod === "GET" && data !== null) {
      const queryString = new URLSearchParams(data).toString();
      targetUrl = `${url}?${queryString}`;
    }

    const response = await fetch(targetUrl, fetchOptions);

    if (!response.ok) {
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
    } else {
      responseData = await response.text();
    }

    success?.(responseData, response.statusText, response);
    return responseData;
  } catch (err) {
    console.error("customAjax error:", err);
    error?.(
      {
        status: err.status || 0,
        statusText: err.statusText || "Network Error",
        responseText: err.responseText || err.message,
      },
      err.statusText || "error",
      err
    );
    throw err;
  }
}
