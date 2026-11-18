# 1 How to retrieve or access values from JSON when 'data' object is not availble?
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

# How to pass username and password or authentication parameters?

# Basic Authentication
Use auth().basic() to pass username and password.
Response response =
    given()
        .auth().basic("admin", "password123")
    .when()
        .get("/api/employees");

Assert.assertEquals(response.getStatusCode(), 200);

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

# =================================================================================================================================
# 29. What is ObjectMapper in Rest Assured/Jackson library?
- Jackson's ObjectMapper converts 
Java objects into JSON and JSON into Java objects. This process is called serialization and deserialization.

Serialization: Java object to JSON
Suppose we have an Employee class:
public class Employee {
    private String name;
    private int age;

    public Employee() {}

    public Employee(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String getName() {
        return name;
    }

    public int getAge() {
        return age;
    }
}

Now convert the object to JSON using Jackson:
import com.fasterxml.jackson.databind.ObjectMapper;

public class EmployeeTest {
    public static void main(String[] args) throws Exception {

        Employee employee = new Employee("Jwala", 30);

        ObjectMapper mapper = new ObjectMapper();

        String json = mapper.writeValueAsString(employee);

        System.out.println(json);
    }
}

Output:
{
  "name": "Jwala",
  "age": 30
}

Here, writeValueAsString() serializes the Java object into a JSON string.
When is this useful? When you want to create an API request body from a Java object instead of manually constructing JSON strings.

Deserialization: JSON to Java object
Suppose the API returns this JSON:
{
  "name": "Jwala",
  "age": 30
}

You can convert it into an Employee object:
String json = """
    {
        "name": "Jwala",
        "age": 30
    }
    """;

ObjectMapper mapper = new ObjectMapper();

Employee employee = mapper.readValue(json, Employee.class);

System.out.println(employee.getName());
System.out.println(employee.getAge());

Output:
Jwala
30

Here, readValue() deserializes the JSON into a Java object.

# How do you use ObjectMapper with REST Assured?
A. Convert a Java object into a request body
import com.fasterxml.jackson.databind.ObjectMapper;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;

Employee employee = new Employee("Jwala", 30);

ObjectMapper mapper = new ObjectMapper();
String requestBody = mapper.writeValueAsString(employee);

RestAssured.given().contentType(ContentType.JSON).body(requestBody)
.when()
.post("/employees")
.then()
.statusCode(201);


This explicitly uses Jackson to serialize the object before sending it.
B. Let REST Assured serialize the object automatically
You often don't need to instantiate ObjectMapper yourself:
Employee employee = new Employee("Jwala", 30);

given().contentType(ContentType.JSON).body(employee)
.when()
    .post("/employees")
.then()
    .statusCode(201);


When a compatible Jackson serializer is available and configured, REST Assured can serialize the Java object automatically.

Interview distinction: REST Assured handles the HTTP request and response; Jackson provides JSON-to-object and object-to-JSON conversion.

# Serialization/Deserialization:
1. Serialization
Serialization is the process of converting a Java object into a JSON.
In simple words:
Java Object → JSON

2. Deserialization
Deserialization is the process of converting JSON data received from an API into a Java object.

In simple words:
JSON → Java Object

Interview-ready answer:
Serialization is the process of converting a Java object into JSON format, generally when sending request payloads to an API. Deserialization is the reverse process, where JSON 
received from an API is converted into a Java object. In REST Assured, we can use POJOs with the body() method for serialization and response.as(Employee.class) for deserialization. 
Jackson's ObjectMapper can perform both conversions.

My recommendation: Remember this simple rule for interviews:
- POST/PUT: Java POJO → JSON = Serialization.
- GET response: JSON → Java POJO = Deserialization

# => a follow-up question comes, after Serialization  and Deserialization, What is ObjectMapper?

# What is ObjectMapper?
- Avoids manually building JSON strings.
- Makes request payloads easier to maintain using POJOs.
- Converts API responses into Java objects for assertions.
- Supports nested objects and collections.
- Supports configuration for property naming, unknown fields, date formats, and custom serializers/deserializers.
For example, you can deserialize an API response and then assert against typed fields instead of repeatedly extracting individual JSON values.

Interview-ready answer
ObjectMapper is a class from the Jackson Databind library used to serialize Java objects into JSON and deserialize JSON into Java objects. 
Using POJOs and ObjectMapper improves type safety, readability, and maintainability compared with manually constructing JSON strings.

Remember these two methods:
- writeValueAsString(object)	Java object → JSON string
- readValue(json, Employee.class)	JSON string → Java object

Example:
Serialization:
ObjectMapper mapper = new ObjectMapper();
String json = mapper.writeValueAsString(employee);

Deserialization:
Employee employee = mapper.readValue(json, Employee.class);

# What is API mocking?
API mocking means creating a simulated API that behaves like a real API without depending on the actual backend service.
WireMock intercepts requests sent to its mock server and returns predefined responses.
Step 1 — Create a WireMock server and define a mock API

When would you use API mocking in a real project?
Consider this scenario:

You are testing an Order Management application.

When a user places an order, your application calls three external services:
1. Payment Service
2. Inventory Service
3. Notification Service
However, the Payment Service is not ready yet.

Instead of blocking your testing activities, you can mock the Payment API using WireMock.

For example:
- Return 200 when payment succeeds.
- Return 400 when payment details are invalid.
- Return 500 when the payment service encounters an internal error.
- Simulate a timeout to test how your application handles slow responses.
This allows you to test your application's behavior without depending on the actual Payment Service.

# How do you handle API authentication using Bearer Tokens?


# How do you generate and publish Extent or Allure reports as part of a CI/CD pipeline?


# 37. Write Java code to verify the response of API for a particular scenario with assertions.


# ## 2. Senior SDET-Specific Puzzles and Scenarios

These scenarios distinguish a Senior SDET from a candidate who focuses only on coding problems. They evaluate debugging skills, automation architecture, API testing, CI/CD reliability, and problem-solving ability.

| Interview Problem                                         |                                                What the Interviewer Evaluates |
------------------------------------------------------------------------------------------------------------------------------------------------------------------------
| Tests pass locally but fail in GitHub Actions             |Environment differences, file paths, configuration, environment variables, timing issues, and CI debugging |
------------------------------------------------------------------------------------------------------------------------------------------------------------------------
| Tests fail only during parallel execution                 | Shared state, worker isolation, race conditions, concurrent execution, and test independence |
------------------------------------------------------------------------------------------------------------------------------------------------------------------------
| API returns 10,000 records; how would you validate        |
them efficiently?                                           | Pagination, batching, schema validation, data integrity, response time, and performance optimization |
------------------------------------------------------------------------------------------------------------------------------------------------------------------------
| Retry mechanism hides intermittent failures               | Flaky-test analysis, retry policies, root-cause investigation, failure classification, and reporting |
------------------------------------------------------------------------------------------------------------------------------------------------------------------------
| Test execution takes 90 minutes; how would you reduce it? | Parallelization, bottleneck analysis, test selection, execution profiling, and CI optimization |
------------------------------------------------------------------------------------------------------------------------------------------------------------------------
| A UI test passes despite an incorrect backend response    | Independent assertions, API validation, UI-to-backend consistency, and end-to-end test validity |
------------------------------------------------------------------------------------------------------------------------------------------------------------------------
| Test data gets corrupted across workers                   | Test data factories, unique test data, worker isolation, cleanup strategies, and concurrency control |
------------------------------------------------------------------------------------------------------------------------------------------------------------------------
| An API intermittently returns HTTP 429 or 503             | Rate limiting, exponential backoff, retry policies, idempotency, service resilience, and error handling |
------------------------------------------------------------------------------------------------------------------------------------------------------------------------
| A locator matches multiple elements                       | Locator uniqueness, semantic selectors, strict-mode handling, DOM analysis, and robust locator design |
------------------------------------------------------------------------------------------------------------------------------------------------------------------------
| An AI agent produces inconsistent results                 | Nondeterminism, evaluation datasets, response quality thresholds, 
                                                            | tool-call       validation,   trace analysis, and reproducibility |
------------------------------------------------------------------------------------------------------------------------------------------------------------------------
| A test suite has a 99% pass rate but still misses         |Coverage quality, risk-based testing, assertion effectiveness, mutation testing, 
production bugs                                             |and production defect analysis                                                                             |
------------------------------------------------------------------------------------------------------------------------------------------------------------------------ 
| Design a test framework for multiple environments         |Framework architecture, fixtures, configuration management,
                                                            | environment isolation, maintainability, and scalability
------------------------------------------------------------------------------------------------------------------------------------------------------------------------


### Preparation Tip
For each scenario, prepare an answer covering:

1. **Problem analysis:** Clarify the symptoms and gather evidence.
2. **Investigation:** Identify logs, reports, traces, metrics, and configurations to inspect.
3. **Root cause:** Explain the likely causes and how to verify them.
4. **Solution:** Describe the immediate fix and long-term prevention.
5. **Validation:** Explain how you would confirm the fix and prevent regression.


# 1. REST Assured validation — complete code
# Scenario: Send a GET request to fetch a user and validate the HTTP status, response body, headers, and response time.
# ----> This is also a way of writing code, prefer testNG approach
import io.restassured.RestAssured;
import io.restassured.response.Response;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;

public class UserApiTest {

    @Test
    public void validateUserResponse() {

        RestAssured.baseURI = "https://reqres.in";

        given()
            .header("Accept", "application/json")

        .when()
            .get("/api/users/2")

        .then()
            // 1. Validate status code
            .statusCode(200)

            // 2. Validate response content type
            .contentType("application/json")

            // 3. Validate response body
            .body("data.id", equalTo(2))
            .body("data.email", containsString("@"))
            .body("data.first_name", not(emptyString()))

            // 4. Validate response headers
            .header("Content-Type", containsString("application/json"))

            // 5. Validate response time
            .time(lessThan(5000L));
    }
}

# 2. Types of validations in REST Assured
Validation type	REST Assured example
Status code	         	   |   .statusCode(200)
------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Response body	  		   |   .body("data.id", equalTo(2))
------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Header	           		   |   .header("Content-Type", containsString("application/json"))
------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Content type	   		   |   .contentType("application/json")
------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Response time	   		   |   .time(lessThan(5000L))
------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Collection size	  		   |   .body("data.size()", equalTo(2))
------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Value exists	  		   |   .body("data.email", notNullValue())
------------------------------------------------------------------------------------------------------------------------------------------------------------------------
String contains text	   |   .body("data.first_name", containsString("Jan"))
------------------------------------------------------------------------------------------------------------------------------------------------------------------------
JSON schema	               |   Validate the complete response structure against a JSON schema
------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Business rules	  		   |   Validate that returned values satisfy application-specific requirements
------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# 3. 3. Extract response and validate using TestNG assertions
Sometimes an interviewer expects you to extract the response and write assertions separately.
import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.annotations.Test;

import static io.restassured.RestAssured.*;

public class UserApiValidationTest {

    @Test
    public void validateUser() {

        Response response =
            given()
                .baseUri("https://reqres.in")
            .when()
                .get("/api/users/2");

        // Status code validation
        Assert.assertEquals(response.getStatusCode(), 200);

        // Response body validation
        int id = response.jsonPath().getInt("data.id");
        String email = response.jsonPath().getString("data.email");
        String firstName =
            response.jsonPath().getString("data.first_name");

        Assert.assertEquals(id, 2);
        Assert.assertNotNull(email);
        Assert.assertTrue(email.contains("@"));
        Assert.assertFalse(firstName.isEmpty());

        // Header validation
        Assert.assertTrue(
            response.getHeader("Content-Type")
                .contains("application/json")
        );
    }
}


# difference between request specification and response specification
Request Specification = What you send to the API.

Response Specification = What you expect to validate in the API response.

1. Key differences
Feature         	        Request Specification	                                            Response Specification
------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Purpose	Defines             reusable request configurations	                                    Defines reusable response expectations
------------------------------------------------------------------------------------------------------------------------------------------------------------------------
REST Assured interface  	RequestSpecification	                                            ResponseSpecification
------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Used for	                Preparing API requests	                                            Validating API responses
------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Common configurations	    Base URI, headers, query parameters, authentication, request body	Expected status code, content type, headers, response body
------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Applied using	            given() / spec()	                                                then() / spec()
------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Main benefit	            Avoids repeating request setup	                                    Avoids repeating common response validations
------------------------------------------------------------------------------------------------------------------------------------------------------------------------


# (Very important) 2. Request Specification example
Suppose multiple API tests use the same base URI, authentication token, and content type.
import io.restassured.builder.RequestSpecBuilder;
import io.restassured.specification.RequestSpecification;

import static io.restassured.http.ContentType.JSON;

RequestSpecification requestSpec =
    new RequestSpecBuilder()
        .setBaseUri("https://api.example.com")
        .setContentType(JSON)
        .addHeader("Authorization", "Bearer your-token")
        .build();

Reuse it in an API test:
given()
    .spec(requestSpec)
.when()
    .get("/users")
.then()
    .statusCode(200);

Here, the request specification provides common request settings, so you don't have to repeat them in every test.
3. Response Specification example
Suppose every successful API response should return HTTP 200 and JSON content.
import io.restassured.builder.ResponseSpecBuilder;
import io.restassured.specification.ResponseSpecification;

import static org.hamcrest.Matchers.*;

ResponseSpecification responseSpec =
    new ResponseSpecBuilder()
        .expectStatusCode(200)
        .expectContentType("application/json")
        .build();

Reuse it in a test:
given()
    .spec(requestSpec)
.when()
    .get("/users")
.then()
    .spec(responseSpec)
    .body("data", notNullValue());

# Remember this simple distinction:
- requestSpec → prepares the request.
- responseSpec → validates common response expectations.
- Assert.assertEquals(response.getStatusCode(), 200) → performs a direct assertion on the response using TestNG or JUnit, rather than requiring a ResponseSpecification.


# what are the components of an http request?
1. Request line
Specifies the HTTP method, target resource, and protocol version.
POST /api/users HTTP/1.1

2. Headers
Provide metadata, authentication information, content format, and other request details.
Host: example.com
Authorization: Bearer <token>
Content-Type: application/json
Accept: application/json

3. Request body (optional)
Carries data sent to the server, commonly with POST, PUT, or PATCH.
{
  "name": "Jwala",
  "role": "SDET"
}

# how to execute a postman collection endto end
# End-to-end execution flow
1. Create or import collection
Organize API requests and test scripts.

2. Configure environment
Set base URL, credentials, tokens, and variables.

3. Set execution order
Use folders, request ordering, and workflow logic.

4. Execute collection
Run requests and execute pre-request and test scripts.

5. Validate results
Check status codes, response bodies, headers, and business rules.

6. Generate report
Review passed/failed assertions and execution details.

7. Integrate with CI/CD

# API mocking sample example using [RestAssured + wiremock] for interview perspective.
1. What is API mocking?
API mocking means creating a simulated API that behaves like a real API without depending on the actual backend service.

For example, suppose your application calls:
GET https://api.company.com/employees/101

But the actual Employee API:
- Has not been developed yet.
- Is temporarily unavailable.
- Returns inconsistent data.
- Is difficult to test with specific error responses.
Instead of waiting for the actual API, we create a mock API using WireMock.

WireMock intercepts requests sent to its mock server and returns predefined responses.

REST Assured Test (Sends HTTP request)
       |
       v
WireMock Server (Matches request against predefined stubs)
       |
       v        
Mock JSON Response (Returns predefined status code and response body)
       |
       v 
REST Assured Assertions (Validates status, headers, and response data)

2. Practical example: Mock an Employee API
Suppose the actual Employee API is not ready, but you need to test the following endpoint:
GET /api/employees/101


Expected mock response:
{
  "id": 101,
  "employee_name": "Tiger Nixon",
  "employee_salary": 320800,
  "employee_age": 61
}


We will use WireMock to simulate this API and REST Assured to validate it.

3. Add Maven dependencies
Add these dependencies to your pom.xml.
<dependencies>

    <!-- REST Assured -->
    <dependency>
        <groupId>io.rest-assured</groupId>
        <artifactId>rest-assured</artifactId>
        <version>5.5.0</version>
        <scope>test</scope>
    </dependency>

    <!-- WireMock -->
    <dependency>
        <groupId>org.wiremock</groupId>
        <artifactId>wiremock</artifactId>
        <version>3.13.1</version>
        <scope>test</scope>
    </dependency>

    <!-- TestNG -->
    <dependency>
        <groupId>org.testng</groupId>
        <artifactId>testng</artifactId>
        <version>7.10.2</version>
        <scope>test</scope>
    </dependency>

</dependencies>

4. Step 1 — Create a WireMock server and define a mock API
We will start WireMock on a local port and configure it to return a predefined employee response whenever it receives a matching GET request.

EmployeeApiMockTest.java

import com.github.tomakehurst.wiremock.WireMockServer;
import io.restassured.RestAssured;
import io.restassured.response.Response;

import org.testng.annotations.BeforeClass;
import org.testng.annotations.AfterClass;
import org.testng.annotations.Test;

import static com.github.tomakehurst.wiremock.client.WireMock.*;
import static org.testng.Assert.*;

public class EmployeeApiMockTest {

    private WireMockServer wireMockServer;

    @BeforeClass
    public void setUp() {

        // Start WireMock server
        wireMockServer = new WireMockServer(8089);
        wireMockServer.start();

        // Configure REST Assured
        RestAssured.baseURI = "http://localhost";
        RestAssured.port = 8089;

        // Define mock API
        wireMockServer.stubFor(
            get(urlEqualTo("/api/employees/101"))
                .willReturn(
                    aResponse()
                        .withStatus(200)
                        .withHeader("Content-Type", "application/json")
                        .withBody("""
                            {
                                "id": 101,
                                "employee_name": "Tiger Nixon",
                                "employee_salary": 320800,
                                "employee_age": 61
                            }
                            """)
                )
        );
    }

    @Test
    public void verifyEmployeeApi() {

        // Send request to mock API
        Response response =
            RestAssured.given()
                .when()
                .get("/api/employees/101");

        // Validate response
        assertEquals(response.getStatusCode(), 200);

        assertEquals(
            response.getContentType().split(";")[0],
            "application/json"
        );

        assertEquals(
            response.jsonPath().getInt("id"),
            101
        );

        assertEquals(
            response.jsonPath().getString("employee_name"),
            "Tiger Nixon"
        );

        assertEquals(
            response.jsonPath().getInt("employee_salary"),
            320800
        );
    }

    @AfterClass(alwaysRun = true)
    public void tearDown() {

        // Stop WireMock server
        if (wireMockServer != null) {
            wireMockServer.stop();
        }

        RestAssured.reset();
    }
}

Now write a REST Assured test:
@Test
public void verifyEmployeeNotFound() {

    Response response =
        RestAssured.given()
            .when()
            .get("/api/employees/999");

    assertEquals(response.getStatusCode(), 404);

    assertEquals(
        response.jsonPath().getString("error"),
        "Employee not found"
    );
}

8. When would you use API mocking in a real project?
Consider this scenario:

You are testing an Order Management application.

When a user places an order, your application calls three external services:
1. Payment Service
2. Inventory Service
3. Notification Service
However, the Payment Service is not ready yet.

Instead of blocking your testing activities, you can mock the Payment API using WireMock.

For example:
- Return 200 when payment succeeds.
- Return 400 when payment details are invalid.
- Return 500 when the payment service encounters an internal error.
- Simulate a timeout to test how your application handles slow responses.
This allows you to test your application's behavior without depending on the actual Payment Service.

One important distinction: Mocking an API does not prove that the real API works correctly. It proves that your application behaves correctly when it receives the predefined responses. You still need integration testing against the real service when it becomes available.

10. Interview-ready answer
API mocking is the process of simulating an API's behavior without depending on the actual backend service.

For example, suppose I am testing an Employee API, but the actual backend is not ready. I can use WireMock to create a mock endpoint such as /api/employees/101 and configure it to return a predefined JSON response with a status code of 200.

I then use REST Assured to send a GET request to the WireMock server and validate the status code, response headers, and JSON fields.

I can also configure WireMock to simulate different scenarios, such as 400, 401, 404, 500 responses, or network delays.

In a real project, I would use this approach when dependent services are unavailable, when I need deterministic test data, or when I want to validate error-handling and failure scenarios.

REST Assured acts as the API client that sends requests and validates responses, whereas WireMock acts as the mock server that provides predefined responses.


# How to implement parallel execution of APIs (rest assured + TestNG + Java)


# For this, API automation — REST Assured + Java + TestNG How to download a report and check if it has been successfully downloaded then read the data from or validate the data or contents?

# How to download a report and check if it has been successfully downloaded then read the data from or validate the data or contents? (Both UI(JAVA + Selenium) and API(Rest assured  + Java + TestNG))


# How to validate pagination in restassured
Pagination testing in REST Assured means validating that an API returns data in correct pages, respects the requested page size, provides correct pagination metadata, and does not return duplicate or missing records across pages.

Let's understand it with a practical REST Assured + TestNG example.

1. Understand the pagination request
Suppose an employee API supports pagination using page and limit parameters.
GET /api/employees?page=1&limit=10

The API might return:
{
  "page": 1,
  "limit": 10,
  "totalRecords": 25,
  "totalPages": 3,
  "data": [
    {
      "id": 1,
      "name": "John"
    },
    {
      "id": 2,
      "name": "David"
    }
  ]
}

The response above is abbreviated: a complete first page would contain 10 records.

2. Validate pagination metadata
First, validate whether the API returns the correct pagination information.
@Test
public void validatePaginationMetadata() {

    Response response =
        given()
            .queryParam("page", 1)
            .queryParam("limit", 10)
        .when()
            .get("/api/employees");

    Assert.assertEquals(response.getStatusCode(), 200);

    Assert.assertEquals(
        (int) response.jsonPath().getInt("page"), 1);

    Assert.assertEquals(
        (int) response.jsonPath().getInt("limit"), 10);

    Assert.assertEquals(
        (int) response.jsonPath().getInt("totalRecords"), 25);

    Assert.assertEquals(
        (int) response.jsonPath().getInt("totalPages"), 3);
}

What are we validating?
- Requested page number matches the response.
- Requested page size matches the response.
- Total record count is correct.
- Total number of pages is correct.

3. Validate the number of records on each page
If the requested page size is 10, the API should return 10 records on a full page.
@Test
public void validatePageSize() {

    int page = 1;
    int limit = 10;

    Response response =
        given()
            .queryParam("page", page)
            .queryParam("limit", limit)
        .when()
            .get("/api/employees");

    List<Map<String, Object>> employees =
        response.jsonPath().getList("data");

    Assert.assertEquals(employees.size(), limit);
}

Note: The last page may contain fewer records. For example, with 25 records and a page size of 10, the three pages contain 10, 10 and 5 records.
4. Validate the last page
@Test
public void validateLastPage() {

    Response response =
        given()
            .queryParam("page", 3)
            .queryParam("limit", 10)
        .when()
            .get("/api/employees");

    Assert.assertEquals(response.getStatusCode(), 200);

    List<Map<String, Object>> employees =
        response.jsonPath().getList("data");

    Assert.assertEquals(employees.size(), 5);
}

This assumes the API uses 1-based page numbering and has exactly 25 records.
5. Validate that records are not duplicated across pages
This is a particularly important pagination test.

For example, if page 1 returns employee IDs 1–10 and page 2 returns IDs 11–20, there should be no duplicate IDs.

@Test
public void validateNoDuplicateRecordsAcrossPages() {

    Set<Integer> employeeIds = new HashSet<>();

    for (int page = 1; page <= 3; page++) {

        Response response =
            given()
                .queryParam("page", page)
                .queryParam("limit", 10)
            .when()
                .get("/api/employees");

        Assert.assertEquals(response.getStatusCode(), 200);

        List<Integer> ids =
            response.jsonPath().getList("data.id");

        for (Integer id : ids) {

            Assert.assertTrue(
                employeeIds.add(id),
                "Duplicate employee ID found: " + id
            );
        }
    }

    Assert.assertEquals(employeeIds.size(), 25);
}

Here, Set.add() returns false if an ID already exists. This makes it a convenient way to detect duplicates.
6. Important pagination test scenarios
Test scenario	Expected validation
First page	Returns the first set of records
Middle page	Returns the correct records
Last page	Returns remaining records
Page size	Does not exceed requested limit
Invalid page number	Appropriate validation or empty result
Page size = 0	Validation error or documented behavior
Negative page number	Validation error
Page beyond last page	Empty result or documented error
Duplicate records	No duplicate IDs across pages
Missing records	All expected records are accounted for
Total pages	Correct calculation
Empty dataset	Empty data array and correct metadata


7. Senior SDET-level validation: Calculate total pages
You can independently calculate the expected number of pages rather than blindly trusting the API response.

TotalPages = TotalRecords/PageSize

Java implementation:
int totalRecords = 25;
int pageSize = 10;

int expectedTotalPages = (int) Math.ceil((double) totalRecords / pageSize);

Assert.assertEquals(expectedTotalPages, 3);

This is useful for validating pagination metadata against actual business data.

# How to pass authentication or authorization token?
In API testing, we generally pass an authentication or authorization token in the HTTP request headers. The most common approach is the Bearer Token mechanism.

Let's understand this using REST Assured + TestNG.
1. Passing a Bearer token in the request header

Suppose an API requires this header:
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...

REST Assured example:
@Test
public void getEmployeeWithToken() {

    String token = "your_access_token";

    Response response =
        given()
            .header("Authorization", "Bearer " + token)
        .when()
            .get("https://api.example.com/employees")
        .then()
            .extract()
            .response();

    Assert.assertEquals(response.getStatusCode(), 200);
}

Here:
- Authorization is the HTTP header name.
- Bearer is the authentication scheme.
- token is the actual access token.

2. Other ways to pass authentication credentials
Authentication type	        | How to pass it
Bearer Token	            | Authorization: Bearer token
Basic Auth	                | Username and password encoded in Base64
API Key	                    | Header or query parameter, depending on API
OAuth 2.0	                | Usually an access token as a Bearer token
Custom Token	            | Custom header defined by the API

- Basic Authentication
REST Assured provides a built-in method:
given()
    .auth()
    .basic("username", "password")
.when()
    .get("/employees");


- API Key
If the API expects an API key in a header:
given()
    .header("x-api-key", "your_api_key")
.when()
    .get("/employees");

3. How to generate a token and use it in another API?
This is particularly important in real-world API automation.

Imagine two APIs:
1. Login API – generates an access token.
2. Employee API – requires that token to retrieve employee information.

API authentication flow:
Step 1: Login API => Send username and password
		|
Step 2: Receive access token => Extract token from JSON response
		|
Step 3:  Employee API => Pass token in Authorization header
		|
Receive protected API response
HTTP 200 OK

Complete REST Assured example:
@Test
public void authenticateAndGetEmployees() {

    // Step 1: Generate access token
    Response loginResponse =
        given()
            .contentType(ContentType.JSON)
            .body(new LoginRequest("admin", "password"))
        .when()
            .post("/login");

    Assert.assertEquals(loginResponse.getStatusCode(), 200);

    // Step 2: Extract token
    String token = loginResponse.jsonPath()
                                .getString("access_token");

    // Step 3: Use token in another API
    Response employeeResponse =
        given()
            .header("Authorization", "Bearer " + token)
        .when()
            .get("/employees");

    Assert.assertEquals(employeeResponse.getStatusCode(), 200);
}

LoginRequest is a POJO containing the username and password fields. The JSON response field access_token is illustrative; use the actual field returned by your login API.

4. Important interview question: Authentication vs Authorization
Authentication	                            Authorization
Verifies who you are	                    Determines what you can access
Checks identity	                            Checks permissions
Example: Login with username/password	    Example: Admin can delete employees, regular user cannot
Often produces an access token	            Often uses roles, scopes, and permissions associated with identity

Common HTTP status codes:
- 401 Unauthorized – Authentication is missing, invalid, or expired.
- 403 Forbidden – The request is understood, but the authenticated identity does not have sufficient permission.
Technically, HTTP 401 means "Unauthenticated"; 403 means "Authenticated but not authorized" in the typical case.

5. Senior SDET interview tip
Don't hardcode access tokens in your automation framework. Instead:
- Generate tokens dynamically using the authentication API.
- Store credentials in environment variables or CI/CD secrets.
- Reuse tokens where appropriate, considering their expiry.
- Implement token refresh if the API supports it.
- Never log actual tokens or credentials.
One important point: A token is not necessarily authorization by itself. The server validates the token and checks the associated roles, scopes, or permissions before allowing access.

# What is Contract testing in APIs or API contract testing?
API Contract Testing is a testing approach used to verify that an API provider (server) and its consumers (clients) agree on how an API should behave.

In simple terms:
Contract testing ensures that the API provider sends the response that consumers expect, and that consumers send requests in the format the provider supports.

It focuses on the agreement or contract between two communicating services, rather than testing the entire application end to end.

For a Senior SDET interview, it's important to understand how contract testing differs from normal API testing, JSON Schema validation, and API mocking.
1. Understand with a real-world example
Suppose you are working on an e-commerce application with two microservices:
- Order Service: Creates and manages orders.
- Payment Service: Processes payments.
When a user places an order, the Order Service communicates with the Payment Service.

![alt text](image.png)

The two services must agree on:
- Endpoint and HTTP method.
- Required request headers.
- Request body structure and data types.
- Response structure and data types.
- HTTP status codes.
- Error response format.
This agreement is called the API contract.
2. Practical example: Payment API contract
Suppose the Order Service sends the following request:

Request
POST /api/payments
Content-Type: application/json

{
  "orderId": 101,
  "amount": 1500.00,
  "currency": "INR"
}


The Payment Service is expected to return:

Response
{
  "paymentId": "PAY101",
  "orderId": 101,
  "status": "SUCCESS",
  "amount": 1500.00
}

The contract defines that:
Field	Expected type	Requirement
paymentId	String	Required
orderId	Integer	Required
status	String	Required
amount	Number	Required

Now imagine the Payment Service developer changes the response:
{
  "paymentId": "PAY101",
  "orderId": "101",
  "paymentStatus": "SUCCESS",
  "amount": 1500.00
}


There are two potential breaking changes:
1. orderId changed from Integer to String.
2. status was renamed to paymentStatus.
The Order Service may not understand this response, causing payment processing to fail.

Contract testing helps detect these incompatibilities before they cause integration problems.
3. How does API Contract Testing work?
One commonly used approach is Consumer-Driven Contract Testing (CDC), often implemented using Pact.

The process has four main steps:
1. Consumer defines expectations
   
   Order Service defines what request it sends and what response it expects from Payment Service.
2. Contract is generated
   
   The expectations are saved in a contract file, often called a Pact file.
3. Provider verifies the contract
   
   Payment Service is tested against the consumer's expectations to confirm it can fulfill them.
4. Compatibility is confirmed
   
   If verification succeeds, the provider is compatible with that consumer contract. The result can be published to a Pact Broker or another contract repository.

There are two important perspectives:
- Consumer testing: Does the consumer send the expected request and handle the expected response?
- Provider verification: Does the provider actually return responses satisfying the consumer's expectations?
This is particularly useful in microservices architectures where multiple services are developed and deployed independently.

![alt text](image-1.png)

Remember: JSON Schema validation can be one component of contract validation, but it is not automatically full consumer-provider contract testing.
5. Practical example using Pact and Java
Since you're preparing with REST Assured, let's understand where Pact fits into your API automation ecosystem.

Suppose the Order Service expects the Payment Service to return:
{
  "paymentId": "PAY101",
  "status": "SUCCESS"
}

A consumer test using Pact can define that expectation.

Illustrative Java Pact consumer test:


import au.com.dius.pact.consumer.MockServer;
import au.com.dius.pact.consumer.dsl.PactDslWithProvider;
import au.com.dius.pact.consumer.junit5.PactConsumerTestExt;
import au.com.dius.pact.consumer.junit5.PactTestFor;
import au.com.dius.pact.core.model.RequestResponsePact;
import au.com.dius.pact.core.model.annotations.Pact;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URI;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(PactConsumerTestExt.class)
class PaymentConsumerTest {

    @Pact(consumer = "OrderService", provider = "PaymentService")
    public RequestResponsePact createPact(
            PactDslWithProvider builder) {

        return builder
            .given("payment exists")
            .uponReceiving("a request for payment details")
            .path("/api/payments/PAY101")
            .method("GET")
            .willRespondWith()
            .status(200)
            .headers(
                java.util.Map.of("Content-Type", "application/json")
            )
            .body("""
                {
                  "paymentId": "PAY101",
                  "status": "SUCCESS"
                }
                """)
            .toPact();
    }

    @Test
    @PactTestFor(providerName = "PaymentService")
    void verifyPaymentContract(MockServer mockServer)
            throws Exception {

        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(
                mockServer.getUrl() + "/api/payments/PAY101"
            ))
            .GET()
            .build();

        HttpResponse<String> response =
            HttpClient.newHttpClient().send(
                request,
                HttpResponse.BodyHandlers.ofString()
            );

        assertEquals(200, response.statusCode());
        assertTrue(response.body().contains("PAY101"));
        assertTrue(response.body().contains("SUCCESS"));
    }
}

This illustrates the consumer side: Pact provides a mock server based on the interaction, and the consumer test verifies that the consumer can work with it. The generated contract must subsequently be verified against the actual Payment Service provider.
6. Where does REST Assured fit into Contract Testing?
You can use REST Assured to test the provider's actual API against expected contract requirements.

For example:
@Test
public void verifyPaymentResponse() {

    Response response =
        given()
            .baseUri("http://localhost:8080")
        .when()
            .get("/api/payments/PAY101");

    assertEquals(response.getStatusCode(), 200);

    assertEquals(
        response.jsonPath().getString("paymentId"),
        "PAY101"
    );

    assertEquals(
        response.jsonPath().getString("status"),
        "SUCCESS"
    );
}

This is a useful provider API test, but it is not by itself full consumer-driven contract testing. For that, you also need the consumer's expectations and provider verification against the generated contract.

A typical tool combination:
Tool	                Responsibility
REST Assured	        API functional and provider-side testing
WireMock	            Mock external APIs and dependencies
Pact	                Consumer-driven contract creation and verification
JSON Schema Validator	Validate JSON structure and data types

7. When should we use Contract Testing?
Consider a microservices application with 10 independently developed services.

Without contract testing, a developer might change an API response, and the impact may only be discovered when the entire application is integrated.

With contract testing:
- Consumer expectations are documented.
- Provider changes are checked against those expectations.
- Breaking changes can be identified before deployment.
- Teams can develop and test independently.
- Integration surprises are reduced.

8. Interview-ready answer
API Contract Testing is a testing approach used to verify that an API provider and its consumers follow an agreed communication contract.

The contract defines details such as endpoints, HTTP methods, request and response structures, data types, headers, and expected status codes.

For example, suppose an Order Service consumes a Payment Service API. The Order Service expects a response containing paymentId as a String and status as a String. If the Payment Service changes the status field to paymentStatus or changes the data type of paymentId, the consumer might break.

Using consumer-driven contract testing with tools such as Pact, the consumer defines its expectations, a contract is generated, and the provider verifies that it satisfies those expectations.

As an SDET, I would use REST Assured for API functional testing, WireMock for mocking dependencies, and Pact for consumer-provider contract verification.

The main benefit is detecting API compatibility issues early, particularly in microservices architectures where services are developed and deployed independently.

# A sample question related to Schema validation with answer[RestAssured].
Let's prepare a practical API Schema Validation interview question using REST Assured + Java + TestNG.

This is a frequently asked SDET interview topic because it checks whether you understand the difference between validating individual JSON values and validating the overall response structure.
1. Interview question
You are testing an Employee API that returns employee details in JSON format. How would you validate the response schema using REST Assured?

Suppose the API is:
GET https://dummy.restapiexample.com/api/v1/employee/1

Expected JSON response:
{
  "status": "success",
  "data": {
    "id": 1,
    "employee_name": "Tiger Nixon",
    "employee_salary": 320800,
    "employee_age": 61,
    "profile_image": ""
  },
  "message": "Successfully! Record has been fetched."
}

Our objective is to verify that:
- The response follows the expected JSON structure.
- Required fields are present.
- Fields have the correct data types.
- Nested objects have the expected structure.
- Unexpected structural changes are detected.
2. What is JSON Schema Validation?
JSON Schema validation verifies whether a JSON response conforms to a predefined contract.

For example:
Field	                Expected type
------------------------------------------
status	               | String
------------------------------------------
data	               | Object
------------------------------------------
data.id	               | Integer
------------------------------------------
data.employee_name	   | String
------------------------------------------
data.employee_salary   | Integer
------------------------------------------
data.employee_age	   | Integer
------------------------------------------
data.profile_image	   | String
------------------------------------------
message	               | String
------------------------------------------

A normal assertion might verify that employee_name equals "Tiger Nixon".

Schema validation checks the broader structure and types, independently of the particular employee name or salary value.
3. Add the required Maven dependency
REST Assured uses a separate JSON Schema Validator module.

Add this dependency to your pom.xml:
<dependency>
    <groupId>io.rest-assured</groupId>
    <artifactId>json-schema-validator</artifactId>
    <version>5.5.1</version>
    <scope>test</scope>
</dependency>

Make sure its version matches your REST Assured version.
4. Create the JSON Schema file
Create this file:
src
 └── test
      └── resources
           └── employee-schema.json


employee-schema.json

{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "object",
  "required": [
    "status",
    "data",
    "message"
  ],
  "properties": {
    "status": {
      "type": "string"
    },
    "data": {
      "type": "object",
      "required": [
        "id",
        "employee_name",
        "employee_salary",
        "employee_age",
        "profile_image"
      ],
      "properties": {
        "id": {
          "type": "integer"
        },
        "employee_name": {
          "type": "string"
        },
        "employee_salary": {
          "type": "integer"
        },
        "employee_age": {
          "type": "integer"
        },
        "profile_image": {
          "type": "string"
        }
      }
    },
    "message": {
      "type": "string"
    }
  }
}



Understand these important schema keywords:
Keyword	Purpose
type	Defines the expected data type.
required	Specifies mandatory fields.
properties	Defines the structure of an object.
items	Defines the structure of elements inside an array.
additionalProperties	Controls whether unspecified fields are allowed.

Notice that we have not specified an exact employee name or salary. We are validating the response contract, not hardcoding particular employee data.
5. Write the REST Assured + TestNG test

EmployeeSchemaTest.java

import io.restassured.response.Response;

import org.testng.annotations.Test;

import static io.restassured.RestAssured.*;
import static io.restassured.module.jsv.JsonSchemaValidator.*;
import static org.testng.Assert.*;

public class EmployeeSchemaTest {

    @Test
    public void validateEmployeeSchema() {

        Response response =
            given()
                .baseUri("https://dummy.restapiexample.com")
            .when()
                .get("/api/v1/employee/1");

        // Validate HTTP status
        assertEquals(response.getStatusCode(), 200);

        // Validate JSON response schema
        response.then()
            .assertThat()
            .body(matchesJsonSchemaInClasspath(
                "employee-schema.json"
            ));
    }
}

matchesJsonSchemaInClasspath() looks for the schema file inside the test classpath, which includes src/test/resources.
Schema validation configured
If the response violates the schema, the assertion fails and REST Assured reports the validation errors.

![alt text](image-2.png)

8. More interview questions to prepare
Q1. Can schema validation validate nested JSON objects?

Yes. Define nested objects using type: object and their structure inside properties.

Q2. Can we validate an array using JSON Schema?

Yes. Use type: array and items to define the expected structure of each element.

Q3. What if a field can be either a string or null?

You can specify:
{
  "type": ["string", "null"]
}


Q4. Does schema validation verify business logic?

No. Schema validation verifies the response contract. Business rules need separate assertions.

Q5. Why should we maintain schema files separately?

It improves reusability, maintainability, readability, and allows multiple API tests to validate against the same contract.

Interview-ready answer: 
JSON Schema validation in REST Assured is used to verify whether an API response follows the expected JSON structure, including mandatory fields, data types, nested objects, and arrays.

I use the json-schema-validator dependency and maintain schema definitions separately under src/test/resources.

During API testing, I send the request using REST Assured and validate the response using matchesJsonSchemaInClasspath().

I also perform separate JSONPath assertions for business-specific validations because schema validation alone doesn't verify business logic.

This approach helps identify contract violations early, such as missing fields, incorrect data types, or unexpected structural changes.

My recommendation for Senior SDET interviews: Remember this distinction:
- JSONPath assertions → Are the actual values correct?
- JSON Schema validation → Is the response structure correct?
- Business-rule assertions → Does the response satisfy the expected business behavior?