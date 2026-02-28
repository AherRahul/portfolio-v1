---
title: String Methods
description: Learn about String Methods in Java programming.
datePublished: 2026-02-27
dateModified: 2026-02-27
topics:
  - java
courseName: 11-java-fundamentals
showOnArticles: false
featured: false
published: true
---

![hero image](https://algomaster.io/og-image.png)

String manipulation is one of the most common tasks in programming. As we dive into Java's `String` class methods, you'll find a robust set of tools at your disposal. Whether you're searching, modifying, or extracting information, understanding these methods will enhance your ability to work with text effectively.

Let's explore the various string methods Java provides and how you can use them to streamline your code.

# Common String Methods

Java's `String` class comes with a suite of methods that help you perform various operations on strings. Here are some of the most commonly used ones:

### Length and Character Access

The simplest operations often involve checking the length of a string or accessing individual characters.

*   `**length()**`: This method returns the number of characters in a string.

*   `**charAt(int index)**`: This retrieves the character at a specified index.

Remember that string indices are zero-based, so the first character is at index 0.

### Substrings

Extracting a portion of the string is straightforward with the `substring` method.

*   `**substring(int beginIndex)**`: Returns a new string that is a substring starting from the specified index to the end.

*   `**substring(int beginIndex, int endIndex)**`: Returns a substring from the `beginIndex` to `endIndex - 1`.

### String Searching

Searching within strings is another common requirement. Java provides methods to help you find specific characters or sequences.

*   `**indexOf(int ch)**`: Returns the index of the first occurrence of the specified character.

*   `**lastIndexOf(int ch)**`: Returns the index of the last occurrence of the specified character.

*   `**contains(CharSequence sequence)**`: Checks if the string contains a specific sequence of characters.

### String Modification

While strings in Java are immutable, you can create new strings with modified content using various methods.

*   `**toLowerCase()**` **and** `**toUpperCase()**`: These methods convert the string to all lowercase or uppercase letters, respectively.

*   `**trim()**`: This method removes leading and trailing whitespace.

### Replacing Characters and Strings

The ability to replace characters or substrings can be essential for data cleaning and formatting.

*   `**replace(char oldChar, char newChar)**`: Replaces all occurrences of a character with another character.

*   `**replace(CharSequence target, CharSequence replacement)**`: Replaces all occurrences of a substring with another substring.

### Splitting Strings

Sometimes, we need to break a string into an array of substrings. The `split()` method does just that.

*   `**split(String regex)**`: Splits the string around matches of the given regular expression.

### Joining Strings

On the flip side, you might need to join an array of strings into a single string. Java provides a utility for this as well.

*   `**String.join(CharSequence delimiter, CharSequence... elements)**`: Joins the provided elements with the specified delimiter.

# String Conversion

Converting between data types and strings is another common task you'll encounter.

### Converting to String

You can convert different data types to strings using a few approaches.

*   `**String.valueOf()**`: Converts various data types to their string representation.

*   `**Integer.toString()**`: Specifically for integers, this method converts the integer to a string.

### Converting from String

When handling user input, you often need to convert strings back into other data types.

*   `**Integer.parseInt()**`: Converts a string to an integer.

*   `**Double.parseDouble()**`: Converts a string to a double.

Be cautious when converting strings to numbers. If the string is not a valid representation of a number, a `NumberFormatException` will be thrown.

# String Formatting

Formatting strings is crucial for display purposes, and Java provides several methods for this.

### Using `String.format()`

The `String.format()` method allows you to create formatted strings using placeholders.

You can use different format specifiers for various data types, such as `%f` for floating-point numbers or `%x` for hexadecimal integers.

### Using `MessageFormat`

For more complex formatting scenarios, the `MessageFormat` class can be useful.

This can be particularly handy in internationalization (i18n) scenarios where you need to insert multiple variables into a string template.

# Performance Considerations

While strings are versatile, performance can be a concern in certain situations.

### Immutability

Java strings are immutable, meaning that every time you modify a string, a new string object is created. This can lead to performance issues, especially in loops.

Instead, use `StringBuilder` for better performance when concatenating strings.

### Conclusion on Performance

Always consider the context of your string operations. For heavy manipulation, `StringBuilder` or `StringBuffer` can be more efficient than repeated string concatenation.

In the next chapter, we will look at how Java handles string data under the hood, what immutability means for performance and memory, and why it matters in your applications.

```java
String text = "Hello, World!";
System.out.println(text.length()); // Output: 13
```


```java
char firstChar = text.charAt(0);
System.out.println(firstChar); // Output: H
```


```java
String subText = text.substring(7);
System.out.println(subText); // Output: World!
```


```java
String partText = text.substring(0, 5);
System.out.println(partText); // Output: Hello
```


```java
int index = text.indexOf('W');
System.out.println(index); // Output: 7
```


```java
int lastIndex = text.lastIndexOf('o');
System.out.println(lastIndex); // Output: 8
```


```java
boolean hasWorld = text.contains("World");
System.out.println(hasWorld); // Output: true
```


```java
String upperText = text.toUpperCase();
System.out.println(upperText); // Output: HELLO, WORLD!

String lowerText = text.toLowerCase();
System.out.println(lowerText); // Output: hello, world!
```


```java
String paddedText = "   Hello, World!   ";
String trimmedText = paddedText.trim();
System.out.println(trimmedText); // Output: Hello, World!
```


```java
String replacedText = text.replace('o', '0');
System.out.println(replacedText); // Output: Hell0, W0rld!
```


```java
String newText = text.replace("World", "Java");
System.out.println(newText); // Output: Hello, Java!
```


```java
String csv = "apple,banana,cherry";
String[] fruits = csv.split(",");
for (String fruit : fruits) {
	System.out.println(fruit);
}
// Output:
// apple
// banana
// cherry
```


```java
String[] words = {"Hello", "World"};
String joinedText = String.join(" ", words);
System.out.println(joinedText); // Output: Hello World
```


```java
int number = 42;
String numberString = String.valueOf(number);
System.out.println(numberString); // Output: 42
```


```java
String intString = Integer.toString(number);
System.out.println(intString); // Output: 42
```


```java
String numString = "58";
int parsedNumber = Integer.parseInt(numString);
System.out.println(parsedNumber); // Output: 58
```


```java
String priceString = "19.99";
double parsedPrice = Double.parseDouble(priceString);
System.out.println(parsedPrice); // Output: 19.99
```


```java
String name = "Alice";
int age = 30;
String formatted = String.format("%s is %d years old.", name, age);
System.out.println(formatted); // Output: Alice is 30 years old.
```


```java
import java.text.MessageFormat;

String template = "{0} is {1} years old.";
String message = MessageFormat.format(template, name, age);
System.out.println(message); // Output: Alice is 30 years old.
```


```java
String result = "";
for (int i = 0; i < 1000; i++) {
    result += i; // Creates many intermediate String objects
}
```


```java
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 1000; i++) {
    sb.append(i);
}
String result = sb.toString(); // More efficient
```
