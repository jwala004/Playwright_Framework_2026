# 1. Suppose a web app is not ready then how you will do testing
If the web application is not ready, I would follow a shift-left testing approach. I wouldn't wait for the UI or the complete application to be developed.
First, I would review the requirements, user stories, UI designs, and API specifications to identify test scenarios and acceptance criteria.
Second, if the backend APIs are not ready, I would use API mocking or service virtualization to simulate the expected responses. This would allow me to test frontend behavior, including positive and negative scenarios, error handling, loading states, and boundary conditions.
Third, I would begin API testing as soon as endpoints or a testable service become available. I would validate status codes, headers, response payloads, schema, and business rules.
In parallel, I would develop automation scripts using Playwright or Selenium, prepare test data, and integrate the tests into the CI/CD pipeline.
Once the actual application becomes available, I would replace the mocks with real services and execute integration, end-to-end, regression, and cross-browser testing.
This approach helps identify defects early, reduces dependency on development completion, and improves overall testing efficiency.

2. How would you test when different components are not ready?
Application status	            Testing approach	                                                        Example
UI is not ready	                Review requirements, design test cases, prepare automation framework Prepare login test scenarios
UI is ready, backend is 
not ready	                    Mock API responses	                               Simulate successful and failed login responses
Backend API is ready, UI is 
not ready	                    Test APIs independently	                        Validate status codes, schema, and business rules
UI and backend are 
independently ready	            Component and integration testing	                Verify frontend sends the correct payload
Entire application is ready	    End-to-end and regression testing	                Login → dashboard → logout

# 2. How would you resolve conflicts in your team?


# 3. What is the most challenging thing you faced while designing automation framework?

**Answer:**

The most challenging part was not simply writing automation scripts, but designing a framework that was maintainable, reusable, environment-independent, and secure enough for both local development and CI/CD execution.

I would highlight three major challenges:

**1. Centralizing Test-Data Source Management**

One of the challenges was supporting multiple test-data sources and formats, such as JSON, CSV, and Excel, without coupling test cases to the underlying reading implementations. To address this, I designed a centralized `TestDataFactory` that acts as a single entry point for loading test data and delegates the actual reading to format-specific readers. I also integrated schema validation to ensure that the loaded data conforms to the expected structure and data types.

This design separates test execution from test-data source handling, reduces code duplication, and makes it easier to extend the framework to support additional data formats without changing existing test cases.

**2. Managing Environment Configuration Locally and in CI/CD**

Another challenge was ensuring that the same automation framework could run reliably across QA, UAT, and PROD without hardcoding environment-specific values.

I addressed this by separating environment configuration from test logic, using environment-specific configuration files locally and CI/CD environment variables or secrets where appropriate. I also added configuration validation to fail fast when required variables were missing.

This made the framework more portable and reduced configuration-related failures between local and CI environments.

**3. Secure Management of Sensitive Data**

The third challenge was protecting sensitive information, such as usernames, passwords, API tokens, and authentication credentials, while keeping the framework easy to execute locally and in CI/CD.

Locally, I used environment variables and untracked `.env` files, ensuring that sensitive configuration was excluded from version control through `.gitignore`. In GitHub Actions, I used repository or environment-level secrets and injected them into the test process at runtime.

I also ensured that credentials were not hardcoded in test scripts, committed in configuration files, or unnecessarily exposed in logs and reports. Where appropriate, I used masked values and avoided logging authentication headers or passwords.

4. Architecting the framework for fail-fast execution
Challenge 4: Architecting the framework for fail-fast execution
One of the important design considerations was ensuring that the framework detected configuration and infrastructure problems as early as possible, rather than allowing tests to start and fail unpredictably later.
I approached this by validating mandatory environment variables, checking supported environment names, validating test data against schemas, and detecting invalid configuration before executing test cases. I would also validate required files and dependencies during initialization where practical.
For example, if BASE_URL is missing, the framework should report a clear configuration error immediately instead of launching the browser and failing on navigation. Similarly, malformed test data should be rejected before the test executes business steps.
The goal is to fail early, fail clearly, and fail at the correct layer. This reduces wasted CI execution time, makes root-cause analysis easier, and prevents infrastructure or configuration problems from being misreported as application defects.

5. Managing Test Data Across Multiple Environments

Another challenge was managing test data across multiple environments, such as QA, UAT, and PROD, where data availability, user accounts, application configurations, and access permissions could differ.

To address this, I designed the framework to separate environment configuration from test-data source handling. The framework loads the appropriate configuration based on the selected environment and allows tests to consume environment-specific datasets without hardcoding environment-dependent values into test cases. I also considered data validation and the handling of sensitive values to ensure that the selected data was appropriate for the target environment.

This approach improved maintainability and reduced environment-related failures. It also made the framework easier to execute locally and through CI/CD pipelines by keeping environment selection explicit and configuration centralized.

6. another point respective to selenium, proper driver management



# Practical examples in your Playwright + TypeScript framework
Failure condition	                        Fail-fast behavior
Missing BASE_URL	                        Stop during configuration initialization
Unsupported environment such as staging2	Reject the environment before running tests
Missing username or password	            Report which required variable is missing without printing its value
Invalid JSON/CSV/Excel test data	        Fail schema validation before executing test steps
Missing required test-data file	            Throw a clear file-path error during data loading
Invalid framework configuration	            Stop setup instead of allowing cascading failures
Application temporarily unavailable	        Report an infrastructure/setup failure distinctly from an assertion failure

One important senior-level distinction
Fail-fast does not mean stopping the entire suite whenever any test fails.
- Configuration errors: Stop before test execution if the framework cannot run correctly.
- Invalid test data: Stop the affected test or data-loading operation before making invalid assertions.
- Business assertion failures: Report the failure and continue independent tests where appropriate.
- Transient failures: Apply retries selectively when justified, without concealing the original failure.
For your interview, I'd use this line:
"I designed the framework around a fail-fast principle: validate configuration, dependencies, and test data as early as possible so that invalid execution conditions are detected before they cascade into misleading test failures."



5. 

**Conclusion:**

Overall, these challenges taught me that a good automation framework is not just about test coverage. It also needs a clear separation of concerns, consistent configuration management, reliable test-data handling, and secure credential management across local and CI/CD environments.


# 4 can we assign negative priority to test-cases in testng
Ye we can, and negative priority also works correctly. but it is suggested not to use it. as it creates confusion.

# 5 When do you use xpath over css selectors
I prefer CSS selectors for straightforward element identification and use XPath when I need relationship-based navigation or more complex DOM traversal. I choose based on locator reliability and maintainability, not just syntax.

# 6 When do you use javascript executor?
I use JavaScriptExecutor when Selenium's standard WebDriver APIs are insufficient for a specific browser-side operation, not as a replacement for normal Selenium interactions.

Common scenarios where I use JavaScriptExecutor:
Scenario 1: Scroll the page
Scenario 2: Click an element using JavaScript

# 7 What should be the ideal way to store data using selenium web driver only?
I will prefer to use it in a normal java file, and retrieve it using array, list or map based on the type of data.
Data type or requirement	                Recommended approach
Small, fixed values	                        Java constants or a separate data class
Multiple related records	                List, Map, or custom Java objects
Environment-specific configuration	        .properties files or environment variables
Large or frequently changing test datasets	JSON, CSV, or Excel
Sensitive credentials	                    Environment variables or a CI/CD secret store
Data-driven testing with TestNG	            @DataProvider combined with an appropriate data source

# 8 what happens if you receive browser notifications during test automation execution?
My approach is to handle browser notifications through browser configuration before launching the browser, rather than trying to interact with them after they appear.
There are two important scenarios.
1. Scenario 1: Browser permission pop-ups
Solution: Configure Chrome before launching it.
ChromeOptions options = new ChromeOptions();

options.addArguments("--disable-notifications");

WebDriver driver = new ChromeDriver(options);

2. Scenario 2: JavaScript alerts
If the application triggers a JavaScript alert, confirmation, or prompt, handle it using Selenium's Alert interface.
Alert alert = driver.switchTo().alert();

System.out.println(alert.getText());

alert.accept();  // Click OK
// alert.dismiss(); // Click Cancel, where applicable

# 9 what is invalid certificate exception?
an invalid certificate exception occurs when the browser encounters an SSL/TLS certificate that it cannot validate or trust while accessing a website over HTTPS.
For example, when Selenium navigates to https://example.com, Chrome might display a warning such as Your connection is not private instead of loading the application.
1. What causes an invalid certificate exception?
Common causes include:
- Self-signed certificate: The certificate is not issued by a trusted certificate authority.
- Expired certificate: The certificate has passed its validity period.
- Hostname mismatch: The certificate does not match the domain being accessed.
- Untrusted certificate authority: The browser does not trust the issuer.
- Incomplete certificate chain: Required intermediate certificates are missing.

# 10 what is the meaning of 3-tier architecture?
my answer; UI layer, business logic layer, db layer
The three tiers in a typical 3-tier architecture are the Presentation Layer (UI), Business Logic Layer, and Data Layer (Database).

# 11. Write a java program to filter elemnts using java 8

# 12. Write a java program to sort the elements using java 8 

# 13. Comparable vs Comparator

# 14. Explain the new features introuduced in Selenium 4
Selenium 4: Major features:
1. W3C WebDriver protocol: Selenium 4 uses the W3C WebDriver standard as its primary browser automation protocol, improving interoperability between Selenium clients, browser drivers, and browsers.

2. Relative Locators
- above()
- below()
- toLeftOf()
- toRightOf()
- near()

3. New Window and Tab Management
// Open a new tab
driver.switchTo().newWindow(WindowType.TAB);

// Open a new window
driver.switchTo().newWindow(WindowType.WINDOW);

4. Selenium Manager
Selenium Manager automates browser driver management.

Other important features:
- Selenium Grid 4 improvements
- Chrome DevTools Protocol (CDP) support
- WebDriver BiDi support
- Improved Window and Browser APIs
- Take screenshots of individual elements
- Print pages to PDF
- Updated browser options and capabilities
- Improved support for advanced browser automation

# 15. Difference between Page object model(POM) and Page factory


# 16. What is the meaning and uses of the double colon :: (method refrence operator) in Java Streams?


# 17. Where and how have you used Java 8 stremas in your automation framework?


# 18. How do you locate and handle elements inside Shadow DOM?
- getShadowRoot()

# 19. How do you create and throw a custom exception in Java?
- 

# 20. Write selenium code to handle switching between multiple browser windows and frames.
- 

# 21. Implement Serialization and DeSerialization using Java code.


# 22. Implement Oops concepts for a Saving bank system.


# 23. What is the Page factory design pattern?


# 24. What is the Singleton Design Pattern or which other patterns are you familiar with?


# 25. Where can we practically use LinkedList concepts in test automation?
In test automation, I can use LinkedList when I need efficient insertion or removal at the beginning or end of a sequential collection. For example, 
- I can use it to implement a FIFO queue for pending automation tasks
- manage a sequence of actions that are consumed during execution, or maintain a bounded history of recent events.

# 26. Explain the complete Exception hierarachy in Java.
    Object
       |
       v
    Throwable
       |
       +-----------------------------+
       |                             |
       v                             v
      Error                      Exception
       |                             |
       |                             +-----------------------------+
       |                             |                             |
       v                             v                             v
 Serious JVM/System           Checked Exceptions           RuntimeException
 Problems                     (Compile-time checked)       (Unchecked)
                                    |                              |
                                +-- IOException            +-- NullPointerException
                                +-- FileNotFoundException  +-- ArithmeticException       
                                                           


# 27. What is the difference between fail-fast and fail-safe iterators in Java?



# 28. When should you use ConcurrentHashMap?
- ConcurrentHashMap is a thread-safe implementation of the Map interface.
- Use ConcurrentHashMap when multiple threads need to read and update a shared map concurrently, and you need thread-safe operations without synchronizing the entire map for every operation.

# 29. What is ObjectMapper in Rest Assured/Jackson library?
- Jackson's ObjectMapper converts 
Java objects into JSON and JSON into Java objects. This process is called serialization and deserialization.

detailed answer below;

# 30. Explain the CI/CD and continous delivery Jenkins process.


# 31. How do you execute only failed tests in TestNG?
- In TestNG, the standard way to rerun only failed test cases is to use the automatically generated testng-failed.xml file.
- TestNG generates this file when a test run has failures. It contains the failed test methods and their required configuration, allowing you to rerun them without executing the entire suite again.

# 32. How do you read data from the Examples table section in Cucumber without using Scenario outline?
- An Examples table is designed to work with a Scenario Outline, not with a regular Scenario.

- The Examples table is associated with a Scenario Outline, and Cucumber substitutes its values into the outline for each execution. A normal Scenario cannot directly access an Examples table. If I want to execute multiple data combinations without using a Scenario Outline, I can use a DataTable in the step definition and retrieve its rows using asMaps(). Alternatively, I can load test data from an external source such as JSON, CSV, or Excel.

Interview takeaway: 
Examples table → Scenario Outline; 
DataTable → regular Scenario or Scenario Outline step arguments. They are different Cucumber mechanisms.

# 33. How do you perform parallel execution in a Cucumber framework?



# 34. Explain the usage of hooks in Cucumber.


# 35. Explain the CI/CD Jenkins process for running automated Selenium tests.


# 36. What is the difference between Continuous Integration and Continuous Deployment?
Continuous Integration (CI) - Frequently integrate code changes and validate them automatically.
Continuous Deployment (CD) - Automatically release every change that passes the required checks to production.

Continuous Integration is the practice of frequently integrating code changes into a shared repository and automatically building and testing them to detect defects early.

Continuous Deployment goes a step further: every change that successfully passes the required automated tests and deployment checks is automatically released to production without manual release approval.

The key difference is that CI focuses on integrating and validating code, whereas Continuous Deployment automates the entire path through to production release. Continuous Delivery is the related practice in which the application is always release-ready, but production deployment can still require manual approval.

# 37. Write Java code to verify the response of API for a particular scenario with assertions.



# 38. What are the differnet log levels in log4j2?
FATAL → ERROR → WARN → INFO → DEBUG → TRACE
- FATAL / ERROR: Something seriously wrong happened.
- WARN: Something unexpected happened; investigate if necessary.
- INFO: What is happening?
- DEBUG: Why is it happening?
- TRACE: Exactly how is execution progressing?

# 39. what are the different types of dependecy injection used in your framework? usage of @componenet


# 40. What are the root causes of flakiness in Selenium scripts, and in how many ways can you fix them?


# 41. Explain the Root Cause Analysis(RCA) techniques. 


# 42. How you can fix the git conflicts?

In Git, a merge conflict occurs when Git cannot automatically reconcile changes between two branches. This commonly happens when two developers modify the same lines of a file, or when one developer modifies a file while another deletes it.

As a Senior SDET, you should be able to explain how to identify, resolve, and verify conflicts safely.
1. Steps to resolve Git conflicts
Let's assume you are working on a feature branch and want to merge the latest changes from main.

Step 1: Identify the conflict
Run git status to find the files that need attention.

Step 2: Inspect conflicting changes
Open each conflicted file and review both versions.

Step 3: Resolve the conflict
Keep the correct changes, combine them if necessary, and remove conflict markers.

Step 4: Stage and verify
Stage the resolved files, complete the merge or rebase, and run relevant tests.

# 43. Explain the Branching strategy used in Git
- A Git branching strategy defines how a team creates branches, develops features, fixes bugs, merges code, and manages releases.


# 44. What are common Estimation techniques in Agile?

# 45. What metrics do you track to measure project progress in Agile?

# 46. What is a test pyramid concept?


=================================================================================================================================
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

RestAssured.given()
    .contentType(ContentType.JSON)
    .body(requestBody)
.when()
    .post("/employees")
.then()
    .statusCode(201);


This explicitly uses Jackson to serialize the object before sending it.
B. Let REST Assured serialize the object automatically
You often don't need to instantiate ObjectMapper yourself:
Employee employee = new Employee("Jwala", 30);

given()
    .contentType(ContentType.JSON)
    .body(employee)
.when()
    .post("/employees")
.then()
    .statusCode(201);


When a compatible Jackson serializer is available and configured, REST Assured can serialize the Java object automatically.

Interview distinction: REST Assured handles the HTTP request and response; Jackson provides JSON-to-object and object-to-JSON conversion.
5. Why is ObjectMapper useful in API automation?
- Avoids manually building JSON strings.
- Makes request payloads easier to maintain using POJOs.
- Converts API responses into Java objects for assertions.
- Supports nested objects and collections.
- Supports configuration for property naming, unknown fields, date formats, and custom serializers/deserializers.
For example, you can deserialize an API response and then assert against typed fields instead of repeatedly extracting individual JSON values.
6. Interview-ready answer
ObjectMapper is a class from the Jackson Databind library used to serialize Java objects into JSON and deserialize JSON into Java objects. In REST Assured, I can use it to convert a POJO into a JSON request body using writeValueAsString() and convert a JSON response into a POJO using readValue(). REST Assured can also perform these conversions automatically when a compatible Jackson integration is available. Using POJOs and ObjectMapper improves type safety, readability, and maintainability compared with manually constructing JSON strings.

Remember these two methods:
Method	Conversion
writeValueAsString(object)	Java object → JSON string
readValue(json, Employee.class)	JSON string → Java object





