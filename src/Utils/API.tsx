const TAG = "API.js";
const BASE_URL =
  "https://multivendor.freelancedemo.site/apis/public/api/vendor/";
export const IMAGE_B_URL =
  "https://multivendor.freelancedemo.site/apis/public/images/";

export const NODE_URL = "http://13.60.169.86:3000/";
const nodeGetRequest = async (endPoint: string) => {
  try {
    const headers: any = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    const response = await fetch(NODE_URL + endPoint, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      let json = response.json();
      console.log(TAG, "GET Request Error:", json);
      throw new Error(response.statusText || "Request failed");
    }

    return response.json();
  } catch (error) {
    console.error(TAG, "GET Request Error:", error);
    throw error;
  }
};
const nodePostRequest = async (
  endPoint: string,
  data: any = false,
  isFormData = false
) => {
  try {
    const headers: any = {
      Accept: "application/json",
      "Content-Type": isFormData ? "multipart/form-data" : "application/json",
    };

    const response = await fetch(NODE_URL + endPoint, {
      method: "POST",
      headers,
      body: isFormData ? data : JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(response.statusText || "Request failed");
    }

    return response.json();
  } catch (error) {
    console.error(TAG, "POST Request Error:", error);
    throw error;
  }
};
const getRequest = async (endPoint: string) => {
  try {
    const headers: any = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    const response = await fetch(BASE_URL + endPoint, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(response.statusText || "Request failed");
    }

    return response.json();
  } catch (error) {
    console.error(TAG, "GET Request Error:", error);
    throw error;
  }
};
export const getCustomerRequest = async (endPoint: string) => {
  try {
    const headers: any = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    const response = await fetch(
      "https://multivendor.freelancedemo.site/apis/public/api/customer/" +
        endPoint,
      {
        method: "GET",
        headers,
      }
    );

    if (!response.ok) {
      console.log(TAG, "GET Request Error:", response.status);
      throw new Error(response.statusText || "Request failed");
    }

    return response.json();
  } catch (error) {
    console.error(TAG, "GET Request Error:", error);
    throw error;
  }
};

const postRequest = async (endPoint: string, data: any = false) => {
  try {
    const headers: any = {
      Accept: "application/json",
    };

    // If data is FormData, update headers and body
    if (data instanceof FormData) {
      console.log(TAG, "FormData: ", "Multipart/form-data");
      headers["Content-Type"] = "multipart/form-data";
    } else {
      headers["Content-Type"] = "application/json";
    }

    const requestOptions = {
      method: "POST",
      headers,
      body: data instanceof FormData ? data : JSON.stringify(data),
    };

    console.log(TAG, "Endpoint ", BASE_URL + endPoint, requestOptions);
    const response = await fetch(BASE_URL + endPoint, requestOptions);
    if (!response.ok) {
      throw new Error(response.statusText || "Request failed");
    }

    return response.json();
  } catch (error) {
    console.error(TAG, "POST Request Error:", error);
    throw error;
  }
};
export const postRequestWithFile = async (endPoint: string, data: FormData) => {
  try {
    const headers: any = {
      Accept: "application/x-www-form-urlencoded",
      "Content-Type": "multipart/form-data",
      "Accept-Encoding": "gzip, deflate, br",
    };

    const requestOptions = {
      method: "POST",
      headers,
      body: data,
    };

    const response = await fetch(BASE_URL + endPoint, requestOptions);

    if (!response.ok) {
      console.error(TAG, "POST Request Error:", response.status);
      throw new Error(response.statusText || "Request failed");
    }

    return response.json();
  } catch (error) {
    console.error(TAG, "POST Request Error:", error);
    throw error;
  }
};

export { getRequest, postRequest, nodeGetRequest, nodePostRequest };
