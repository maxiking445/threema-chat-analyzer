# UploadApi

All URIs are relative to */api*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**deleteZipDelete**](UploadApi.md#deletezipdelete) | **DELETE** /delete-zip | Löscht ein temporäres Verzeichnis |
| [**uploadZipPost**](UploadApi.md#uploadzippost) | **POST** /upload-zip | Upload ZIP (password protected) |



## deleteZipDelete

> string deleteZipDelete()

Löscht ein temporäres Verzeichnis

Löscht ein angegebenes temporäres Verzeichnis rekursiv

### Example

```ts
import {
  Configuration,
  UploadApi,
} from '';
import type { DeleteZipDeleteRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new UploadApi();

  try {
    const data = await api.deleteZipDelete();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

**string**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Temp-Verzeichnis gelöscht |  -  |
| **400** | Temp-Verzeichnis nicht angegeben oder ungültig |  -  |
| **500** | Fehler beim Löschen |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## uploadZipPost

> string uploadZipPost(xZipPassword, file)

Upload ZIP (password protected)

Nimmt eine passwortgeschützte ZIP-Datei entgegen, entpackt sie in das relative Verzeichnis ./data

### Example

```ts
import {
  Configuration,
  UploadApi,
} from '';
import type { UploadZipPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new UploadApi();

  const body = {
    // string | Passwort der ZIP-Datei
    xZipPassword: xZipPassword_example,
    // Blob | ZIP-Datei
    file: BINARY_DATA_HERE,
  } satisfies UploadZipPostRequest;

  try {
    const data = await api.uploadZipPost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **xZipPassword** | `string` | Passwort der ZIP-Datei | [Defaults to `undefined`] |
| **file** | `Blob` | ZIP-Datei | [Defaults to `undefined`] |

### Return type

**string**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `multipart/form-data`
- **Accept**: `text/plain`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | ZIP successfully extracted |  -  |
| **400** | Bad request / wrong password / invalid zip |  -  |
| **405** | Method not allowed |  -  |
| **500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

