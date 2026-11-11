# When do you use javascript executor?
I use JavaScriptExecutor when Selenium's standard WebDriver APIs are insufficient for a specific browser-side operation, not as a replacement for normal Selenium interactions.

Common scenarios where I use JavaScriptExecutor:
Scenario 1: Scroll the page
Scenario 2: Click on an element using JavaScript

# What should be the ideal way to store data using selenium web driver only?
I will prefer to use it in a normal java file, and retrieve it using array, list or map based on the type of data.
Data type or requirement	                Recommended approach
Small, fixed values	                        Java constants or a separate data class
Multiple related records	                List, Map, or custom Java objects
Environment-specific configuration	        .properties files or environment variables
Large or frequently changing test datasets	JSON, CSV, or Excel
Sensitive credentials	                    Environment variables or a CI/CD secret store
Data-driven testing with TestNG	            @DataProvider combined with an appropriate data source

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


# How do you handle dynamic elements in Selenium using Java?
My approach:
1. Identify stable attributes: Look for attributes such as name, placeholder, aria-label, or data-testid.
2. Use text-based locators: If the element has consistent visible text
3. Use partial attribute matching: If part of an attribute remains consistent, use CSS *= or XPath contains().
4. Use parent-child relationships: Locate the element relative to a stable parent element.
5. Use regular expressions: If the dynamic value follows a predictable pattern, use regex-based matching.
6. Collaborate with developers: If no reliable attribute exists, request a stable automation attribute such as data-testid.

- I also leverage the WebDriverWait class with ExpectedConditions to wait for elements to appear.

#  How do you capture a screenshot of a specific element using Selenium WebDriver?
// 1. Locate the specific element
WebElement element = driver.findElement(By.id("target-element-id"));

// 2. Capture the screenshot as a File
 File sourceFile = element.getScreenshotAs(OutputType.FILE);

// 3. Define the destination path and save the file
File destinationFile = new File("./screenshots/element_snapshot.png");
Files.copy(sourceFile.toPath(), destinationFile.toPath());


# How do you select a dropdown option by visible text in Selenium?



# What is the difference between implicit wait and explicit wait?



# How do you execute Selenium tests in headless mode?


# How do you upload files in Selenium WebDriver without using the Robot class?



# 39. what are the different types of dependecy injection used in your framework? usage of @componenet


# 40. What are the root causes of flakiness in Selenium scripts, and in how many ways can you fix them?


# 38. What are the differnet log levels in log4j2?
FATAL → ERROR → WARN → INFO → DEBUG → TRACE
- FATAL / ERROR: Something seriously wrong happened.
- WARN: Something unexpected happened; investigate if necessary.
- INFO: What is happening?
- DEBUG: Why is it happening?
- TRACE: Exactly how is execution progressing?

# 35. Explain the CI/CD Jenkins process for running automated Selenium tests.

# 28. When should you use ConcurrentHashMap?
- ConcurrentHashMap is a thread-safe implementation of the Map interface.
- Use ConcurrentHashMap when multiple threads need to read and update a shared map concurrently, and you need thread-safe operations without synchronizing the entire map for every operation.



# 






======================================================================================================================================================
# Cucumber BDD

# 1. What is the difference between Scenario and Scenario Outline in BDD Cucumber?


# 33. How do you perform parallel execution in a Cucumber framework?



# 34. Explain the usage of hooks in Cucumber.


# 32. How do you read data from the Examples table section in Cucumber without using Scenario outline?
- An Examples table is designed to work with a Scenario Outline, not with a regular Scenario.

- The Examples table is associated with a Scenario Outline, and Cucumber substitutes its values into the outline for each execution. A normal Scenario cannot directly access an Examples table. If I want to execute multiple data combinations without using a Scenario Outline, I can use a DataTable in the step definition and retrieve its rows using asMaps(). Alternatively, I can load test data from an external source such as JSON, CSV, or Excel.

Interview takeaway: 
Examples table → Scenario Outline; 
DataTable → regular Scenario or Scenario Outline step arguments. They are different Cucumber mechanisms.

