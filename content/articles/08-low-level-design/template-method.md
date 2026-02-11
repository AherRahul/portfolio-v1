---
title: "Template Method Pattern"
description: "Learn how the Template Method Design Pattern enhances code reuse and maintainability by defining algorithm skeletons and allowing subclass customization in report exporting."
datePublished: 2026-02-02
dateModified: 2026-02-02
topics:
  - lld
courseName: 08-low-level-design
showOnArticles: false
---

## Mastering the Template Method Pattern for Efficient Report Exporting

![Smart Watch](https://res.cloudinary.com/duojkrgue/image/upload/v1770051377/Portfolio/lldSystemDesign/LLD-banner_huzyvn.png)

### Introduction to the Template Method Pattern

The **Template Method Design Pattern** is a fundamental behavioral design pattern that provides a blueprint for defining the skeleton of an algorithm in a base class while allowing subclasses to override specific steps without altering the overall structure. This approach is particularly effective when you have a fixed sequence of steps shared across various implementations but need to customize certain parts.

Imagine building a report exporting system that supports multiple formats such as CSV, PDF, and Excel. Although each format requires different handling for headers, data rows, and footers, the overall workflow remains the same. The Template Method Pattern allows you to encapsulate the common workflow once and delegate the varying parts to subclasses, resulting in cleaner, more maintainable code.


![Smart Watch](https://res.cloudinary.com/duojkrgue/image/upload/v1770796257/Portfolio/lldSystemDesign/img/473521b9-ea0c-40ee-adeb-f6d738864911.png)

It’s particularly useful in situations where:

*   You have a well-defined sequence of steps to perform a task.
*   Some parts of the process are shared across all implementations.
*   You want to allow subclasses to customize specific steps without rewriting the whole algorithm.

When you're solving a problem that follows a common high-level structure but has slight variations in a few steps, it's tempting to write a single method with branching logic like `if-else` or `switch` statements to handle those differences.

For example, a `DataExporter` might use `if` conditions to export in CSV, JSON, or XML format.

But as new variations are added, the method becomes bloated, hard to follow, and violates the **Single Responsibility Principle** and the **Open/Closed Principle**.

The **Template Method Pattern** solves this by capturing the common workflow in a **base class** and pushing the customizable steps into **subclasses**, ensuring that the overall structure remains consistent while allowing flexibility where needed.

Let’s walk through a real-world example and see how we can apply the Template Method Pattern to build flexible, extensible, and reusable workflows.

### Why Use the Template Method Pattern?

#### Common Challenges Without the Pattern

Let’s say you’re building a tool that allows your application to **export reports in different formats** — such as **CSV**, **PDF**, and **Excel**.

On the surface, each report exporter has a different output format, but underneath, the overall process is almost identical.

![Template Method](https://res.cloudinary.com/duojkrgue/image/upload/v1770796284/Portfolio/lldSystemDesign/img/d9c2aaaa-2fc7-4d92-9b25-1c7386095542.png)

Here’s the high-level workflow followed by each exporter:

1.  **Prepare Data**: Gather and organize the data to be exported.
2.  **Open File**: Create or open the output file in the desired format.
3.  **Write Header**: Output column headers or metadata (**format-specific**).
4.  **Write Data Rows**: Iterate through the dataset and write the rows (**format-specific**).
5.  **Write Footer**: Add optional summary or footer info.
6.  **Close File**: Finalize and close the output file.

Despite these similarities, if you implement each exporter naively, you'll likely **duplicate a lot of logic**, and that comes at a cost.

#### ReportData

```java
class ReportData {
    public List<String> getHeaders() {
        return Arrays.asList("ID", "Name", "Value");
    }

    public List<Map<String, Object>> getRows() {
        return Arrays.asList(
            Map.of("ID", 1, "Name", "Item A", "Value", 100.0),
            Map.of("ID", 2, "Name", "Item B", "Value", 150.5),
            Map.of("ID", 3, "Name", "Item C", "Value", 75.25)
        );
    }
}
```

#### CsvReportExporterNaive

```java
class CsvReportExporterNaive {
    public void export(ReportData data, String filePath) {
        System.out.println("CSV Exporter: Preparing data (common)...");
        // ... data preparation logic ...

        System.out.println("CSV Exporter: Opening file '" + filePath + ".csv' (common)...");
        // ... file opening logic ...

        System.out.println("CSV Exporter: Writing CSV header (specific)...");
        // String.join(",", data.getHeaders());
        // ... write header to file ...

        System.out.println("CSV Exporter: Writing CSV data rows (specific)...");
        // for (Map<String, Object> row : data.getRows()) { ... format and write row ... }

        System.out.println("CSV Exporter: Writing CSV footer (if any) (common)...");

        System.out.println("CSV Exporter: Closing file '" + filePath + ".csv' (common)...");
        // ... file closing logic ...
        System.out.println("CSV Report exported to " + filePath + ".csv");
    }
}
```

#### PdfReportExporterNaive

```java
class PdfReportExporterNaive {
    public void export(ReportData data, String filePath) {
        System.out.println("PDF Exporter: Preparing data (common)...");
        // ... data preparation logic ...

        System.out.println("PDF Exporter: Opening file '" + filePath + ".pdf' (common)...");
        // ... PDF library specific file opening ...

        System.out.println("PDF Exporter: Writing PDF header (specific)...");
        // ... PDF library specific header writing ...

        System.out.println("PDF Exporter: Writing PDF data rows (specific)...");
        // ... PDF library specific data row writing ...

        System.out.println("PDF Exporter: Writing PDF footer (if any) (common)...");

        System.out.println("PDF Exporter: Closing file '" + filePath + ".pdf' (common)...");
        // ... PDF library specific file closing ...
        System.out.println("PDF Report exported to " + filePath + ".pdf");
    }
}
```

#### Client Code

```java
public class ReportAppNaive {
    public static void main(String[] args) {
        ReportData reportData = new ReportData();

        CsvReportExporterNaive csvExporter = new CsvReportExporterNaive();
        csvExporter.export(reportData, "sales_report");

        System.out.println();

        PdfReportExporterNaive pdfExporter = new PdfReportExporterNaive();
        pdfExporter.export(reportData, "financial_summary");
    }
}
```

### What’s Wrong with This Design?

While this approach might seem straightforward at first, it comes with several serious design drawbacks:

#### Code Duplication

The same steps — preparing data, opening/closing files, writing footers — are repeated in every exporter class. Add an `ExcelReportExporterNaive`, and you're copying the same boilerplate for the third time.

#### Maintenance Overhead

If you decide to change how data is prepared or how files are closed (e.g., to add logging or error handling), you’ll have to update **every exporter class manually** — increasing the risk of introducing bugs.

#### Inconsistent Behavior

Since each exporter implements the entire workflow on its own, there’s a real danger that a developer might:

*   **Omit a step** (e.g., skip the footer),
*   **Change the order** (write data before the header), or
*   **Handle a failure differently** in one exporter but not another.

This leads to **inconsistent logic and fragile code**.

#### Poor Extensibility

Adding a new report format means **copying a full class**, pasting boilerplate, and modifying only a few lines — violating the **DRY (Don't Repeat Yourself)** principle.


### What We Really Need

We need a way to:

*   **Define the common report export workflow once**, in a base class.
*   **Allow subclasses to override only the format-specific steps**, like writing headers and data rows.
*   Ensure that all report exporters **follow the same sequence**, and enforce consistency in the algorithm structure.

This is exactly what the **Template Method Pattern** is designed for.


#### Benefits of the Template Method Pattern

The Template Method Pattern solves these issues by:

- Defining the **fixed sequence** of steps in a base class.
- Allowing **subclasses to customize** only the variable parts.
- Enforcing **algorithm consistency** across all implementations.
- Enhancing **code reuse** and reducing duplication.
- Promoting **extensibility** by making it easy to add new variations.


### The Report Exporting Example: Problem and Solution

#### The Problem: Exporting Reports in Different Formats

Suppose you need to export reports in formats like CSV, PDF, and Excel. Each exporter shares a similar set of steps:

1. Prepare data
2. Open the output file
3. Write the header (format-specific)
4. Write data rows (format-specific)
5. Write footer (optional)
6. Close the file

Implementing each exporter independently leads to duplicated logic and inconsistent workflows.

#### Naive Implementation Issues

Consider the following naive exporters:

- `CsvReportExporterNaive`
- `PdfReportExporterNaive`

Each class repeats the same steps for data preparation, file handling, and footer writing. As new formats are added, the codebase becomes cluttered and difficult to maintain.


### Understanding the Template Method Pattern

#### Definition and Structure

The Template Method Pattern defines an **abstract base class** containing a **template method** that outlines the full algorithm as a sequence of steps. Some steps are implemented in the base class (common behavior), while others are declared as **abstract methods** that subclasses must implement.

Optionally, the base class can define **hook methods** with default behavior that subclasses may override.

#### Class Diagram Overview

![Smart Watch](https://res.cloudinary.com/duojkrgue/image/upload/v1770796293/Portfolio/lldSystemDesign/img/dd841113-0ee2-487f-8aa2-6c3acb18ec1b.png)


- **AbstractClass (e.g., `AbstractReportExporter`)**  
  Contains the `exportReport()` template method and abstract methods like `writeHeader()` and `writeDataRows()`.
  
- **Concrete Classes (e.g., `CsvReportExporter`, `PdfReportExporter`)**  
  Implement the abstract steps specific to their format.

> ### Real-World Analogy
> 
> Think of a general recipe for baking a cake (the Template Method):
> 
> 1.  Preheat the oven (common step).
> 2.  Prepare the batter (this step varies – chocolate cake, vanilla cake, etc. – **abstract step**).
> 3.  Pour batter into a pan (common step).
> 4.  Bake for X minutes (common step, though X might be a hook).
> 5.  Let cool (common step).
> 6.  Frost the cake (optional step – **hook method**).
> 
> The overall baking process is fixed by the general recipe. Specific types of cakes (subclasses) only need to provide their unique batter preparation and might choose to override the frosting step.


### Implementing the Template Method Pattern in Report Exporting

Let’s refactor our report exporting system using the **Template Method Pattern**.

The goal is to extract the **common report generation workflow** into a single base class, while allowing each format-specific exporter to customize only the parts that differ.

#### 1. Abstract Base Class: `AbstractReportExporter`

The base class defines the template method `exportReport()` that outlines the workflow. It provides default (hook) implementations for some steps and declares abstract methods for format-specific steps.

```java
abstract class AbstractReportExporter {
    public final void exportReport(ReportData data, String filePath) {
        prepareData(data);
        openFile(filePath);
        writeHeader(data);
        writeDataRows(data);
        writeFooter(data);
        closeFile(filePath);
        System.out.println("Export complete: " + filePath);
    }

    protected void prepareData(ReportData data) {
        System.out.println("Preparing report data (common step)...");
    }

    protected void openFile(String filePath) {
        System.out.println("Opening file '" + filePath + "'...");
    }

    protected abstract void writeHeader(ReportData data);

    protected abstract void writeDataRows(ReportData data);

    protected void writeFooter(ReportData data) {
        System.out.println("Writing footer (default: no footer).");
    }

    protected void closeFile(String filePath) {
        System.out.println("Closing file '" + filePath + "'...");
    }
}
```

#### 2. Concrete Exporters: CSV and PDF

Subclasses override only the steps that require customization.

#### CSV Exporter

```java
class CsvReportExporter extends AbstractReportExporter {
    @Override
    protected void writeHeader(ReportData data) {
        System.out.println("CSV: Writing header: " + String.join(",", data.getHeaders()));
    }

    @Override
    protected void writeDataRows(ReportData data) {
        System.out.println("CSV: Writing data rows...");
        for (Map<String, Object> row : data.getRows()) {
            System.out.println("CSV: " + row.values());
        }
    }
}
```

#### PDF Exporter

```java
class PdfReportExporter extends AbstractReportExporter {
    @Override
    protected void writeHeader(ReportData data) {
        System.out.println("PDF: Writing header: " + String.join(",", data.getHeaders()));
    }

    @Override
    protected void writeDataRows(ReportData data) {
        System.out.println("PDF: Writing data rows...");
        for (Map<String, Object> row : data.getRows()) {
            System.out.println("PDF: " + row.values());
        }
    }
}
```

#### 3. Client Usage

The client code now simply instantiates the desired exporter and calls the template method.

```java
public class ReportAppTemplateMethod {
    public static void main(String[] args) {
        ReportData data = new ReportData();

        AbstractReportExporter csvExporter = new CsvReportExporter();
        csvExporter.exportReport(data, "sales_report");

        System.out.println();

        AbstractReportExporter pdfExporter = new PdfReportExporter();
        pdfExporter.exportReport(data, "financial_summary");
    }
}
```


### Advantages of Using the Template Method Pattern

- **Eliminates Code Duplication:** By extracting shared workflow logic into a single base class, the pattern removes repetitive code from concrete classes.

- **Enforces Consistency:** The fixed algorithm sequence in the base class ensures all subclasses follow the same steps in the right order.

- **Enhances Extensibility:** Adding new export formats requires only creating a new subclass that implements the abstract steps, without touching existing code.

- **Simplifies Maintenance:** Updates to common steps impact only the base class, reducing the chance of bugs and inconsistencies.

- **Reduces Errors:** By controlling the workflow structure centrally, the pattern prevents accidental omissions or misplaced steps in subclasses.


### When to Apply the Template Method Pattern

The Template Method Pattern is ideal when:

- You have an algorithm that follows a fixed structure but varies in some steps.
- You want to avoid code duplication across similar classes.
- You need to enforce a consistent processing sequence.
- You anticipate frequent addition of new variants with small differences.
- You want to improve maintainability and readability of your codebase.


### Summary

The Template Method Design Pattern is a powerful tool in software design that promotes code reuse, consistency, and maintainability by defining the skeleton of an algorithm in a base class and delegating specific steps to subclasses. In scenarios like exporting reports in multiple formats, this pattern simplifies your code and makes it more robust and extensible.

By applying the Template Method Pattern, you avoid the pitfalls of duplicated logic and inconsistent implementations, ensuring that every exporter follows the same well-defined steps while allowing for flexible customization where needed.


### Frequently Asked Questions (FAQ)

**Q1: Can the Template Method Pattern be combined with other design patterns?**  
Yes, it often complements patterns like Factory Method or Strategy to provide flexible and reusable solutions.

**Q2: Are hook methods mandatory in the Template Method Pattern?**  
No, hook methods are optional. They provide default behavior that subclasses can override to customize optional steps.

**Q3: How does the Template Method Pattern relate to inheritance?**  
It relies on inheritance to share common code and enforce an algorithm’s structure while allowing subclasses to provide specific implementations.

**Q4: What are the alternatives to using the Template Method Pattern?**  
Alternatives include using composition with the Strategy Pattern or simply writing conditional logic, but these approaches may sacrifice clarity or extensibility.


By mastering the Template Method Pattern, developers can craft elegant, maintainable, and scalable software solutions that elegantly handle variations within algorithms.


## Mind Map

![Smart Watch](https://res.cloudinary.com/duojkrgue/image/upload/v1770797629/Portfolio/lldSystemDesign/img/NoteGPT_MindMap_1770797617180_kzmd5p.png)
