# 1
Great question, bro! The key concept to understand is that your JSONPath depends on the structure of the JSON response, not on a fixed keyword like data.

Let's understand this using your employee JSON and a few common API response structures.
1. Case 1: JSON response contains a data object or array
Your example has this structure:
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "employee_name": "Tiger Nixon",
      "employee_salary": 320800,
      "employee_age": 61
    },
    {
      "id": 2,
      "employee_name": "Garrett Winters",
      "employee_salary": 170750,
      "employee_age": 63
    }
  ]
}

Here, data is an array containing employee objects.

To retrieve employee names:
List<String> names = response.jsonPath().getList("data.employee_name");

Assert.assertTrue(names.contains("Tiger Nixon"));


Why data.employee_name? Because employee_name is inside each object in the data array.
2. Case 2: JSON response has no data key
Suppose the API returns this JSON instead:
[
  {
    "id": 1,
    "employee_name": "Tiger Nixon",
    "employee_salary": 320800
  },
  {
    "id": 2,
    "employee_name": "Garrett Winters",
    "employee_salary": 170750
  }
]


Here, the root of the JSON response is itself an array. There is no data wrapper.

You can retrieve employee names like this:
List<String> names =
    response.jsonPath().getList("employee_name");

Assert.assertTrue(names.contains("Tiger Nixon"));


Notice that you don't need data.employee_name. REST Assured evaluates employee_name against the objects in the root array.

You can also retrieve a particular employee's name by index:
String name =
    response.jsonPath().getString("[0].employee_name");

Assert.assertEquals(name, "Tiger Nixon");


The [0] refers to the first object in the root array.
3. Case 3: JSON response is a single object
Suppose the API returns just one employee:
{
  "id": 1,
  "employee_name": "Tiger Nixon",
  "employee_salary": 320800,
  "employee_age": 61
}

There is neither a data wrapper nor a root array. The employee fields are directly at the root.

Retrieve the name:
String name = response.jsonPath().getString("employee_name");

Assert.assertEquals(name, "Tiger Nixon");

Here, employee_name is sufficient because it is a direct property of the root object.
4. Quick reference: Which JSONPath should you use?
JSON response structure	JSONPath for employee names
Object containing an array under data	data.employee_name
Root-level array of employees	employee_name
Single employee object	employee_name
Object containing an array under employees	employees.employee_name
First employee in a root array	[0].employee_name
First employee under data	data[0].employee_name

5. How do you decide the correct path in an interview?
Follow these steps:
1. Inspect the response body to determine whether the root is an object ({}) or an array ([]).
2. If the root is an object, check whether the required property is nested under another key such as data, employees, or results.
3. If the root is an array, access the field directly across its elements or use an index to select a particular element.
4. Use the corresponding JSONPath in REST Assured and validate the returned value.
You can also print the response while debugging:
response.prettyPrint();

Or inspect the root type:
Object body = response.jsonPath().get("$");
System.out.println(body.getClass().getName());

The exact Java type depends on the response structure and REST Assured's parsing.

Interview-ready answer:
In REST Assured, the JSONPath depends on the response structure. If the response contains an array under a key such as data, I use data.employee_name. If the response itself is a root-level array, I can use employee_name to retrieve that field from its elements. If the response is a single object, I use employee_name directly. So, I first inspect the JSON structure and then construct the appropriate JSONPath rather than assuming every API response contains a data key.

# 2 How to pass username and password or authentication parameters?

# Form Authentication
If the API expects username and password as form parameters:
Response response =
    given()
        .contentType(ContentType.URLENC)
        .formParam("username", "admin")
        .formParam("password", "password123")
    .when()
        .post("/api/login");

Assert.assertEquals(response.getStatusCode(), 200);

# JSON Body Authentication
If the login API expects credentials in a JSON request body:
Response response =
    given()
        .contentType("application/json")
        .body(Map.of(
            "username", "admin",
            "password", "password123"
        ))
    .when()
        .post("/api/login");

String token = response.jsonPath().getString("access_token");

# Bearer Token Authentication
If the login API returns an access token, pass it in the Authorization header for subsequent requests.
Response response =
    given()
        .header("Authorization", "Bearer " + token)
    .when()
        .get("/api/employees");

Assert.assertEquals(response.getStatusCode(), 200);


# API Key Authentication
If the API uses an API key:
Response response =
    given()
        .header("x-api-key", "your-api-key")
    .when()
        .get("/api/employees");

# 3. What is path parameter?



# 4. What is query parameter?



# How do you bypass SSL certificate validation errors in API tests?(both when manually testing it in postman or some other tool or when automating it using restassured)

SSL certificate validation errors commonly occur when an API uses a self-signed certificate, an expired certificate, an untrusted Certificate Authority (CA), or an incorrectly configured certificate chain.

How to bypass SSL validation in Postman?
Disable SSL certificate verification from Postman

or Configure CA certificates, Settings → Certificates

How to bypass SSL validation in REST Assured (Java)?
REST Assured provides a built-in method called:
.relaxedHTTPSValidation()

import io.restassured.RestAssured;
import io.restassured.response.Response;

import static io.restassured.RestAssured.*;

public class SSLTest {

    public static void main(String[] args) {

        Response response = given()
                .relaxedHTTPSValidation()
                .baseUri("https://qa-api.example.com")
                .when()
                .get("/employees");

        System.out.println(response.getStatusCode());
        System.out.println(response.getBody().asString());
    }
}







