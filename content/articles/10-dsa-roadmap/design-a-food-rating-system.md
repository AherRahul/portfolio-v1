---
title: Design a Food Rating System
description: Master Design a Food Rating System in the Data Structure Design
  module. Comprehensive guide and algorithmic problem solving.
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - dsa
courseName: 10-dsa-roadmap
showOnArticles: false
published: true
---

# Problem Description

Question

Design a food rating system that can do the following:

*   **Modify** the rating of a food item listed in the system\.
*   Return the highest\-rated food item for a type of cuisine in the system\.

Implement the `FoodRatings` class:

*   `FoodRatings(String[] foods, String[] cuisines, int[] ratings)` Initializes the system\. The food items are described by `foods`, `cuisines` and `ratings`, all of which have a length of `n`\.

*   `foods[i]` is the name of the `i``th` food,
*   `cuisines[i]` is the type of cuisine of the `i``th` food, and
*   `ratings[i]` is the initial rating of the `i``th` food\.

*   `void changeRating(String food, int newRating)` Changes the rating of the food item with the name `food`\.
*   `String highestRated(String cuisine)` Returns the name of the food item that has the highest rating for the given type of `cuisine`\. If there is a tie, return the item with the **lexicographically smaller** name\.

Note that a string `x` is lexicographically smaller than string `y` if `x` comes before `y` in dictionary order, that is, either `x` is a prefix of `y`, or if `i` is the first position such that `x[i] != y[i]`, then `x[i]` comes before `y[i]` in alphabetic order\.

##### **Example 1:**

**Input**

\["FoodRatings", "highestRated", "highestRated", "changeRating", "highestRated", "changeRating", "highestRated"\]

\[\[\["kimchi", "miso", "sushi", "moussaka", "ramen", "bulgogi"\], \["korean", "japanese", "japanese", "greek", "japanese", "korean"\], \[9, 12, 8, 15, 14, 7\]\],

\["korean"\], \["japanese"\], \["sushi", 16\], \["japanese"\], \["ramen", 16\], \["japanese"\]\]

**Output**

\[null, "kimchi", "ramen", null, "sushi", null, "ramen"\]

**Explanation**

```java
FoodRatings foodRatings = new FoodRatings(["kimchi", "miso", "sushi", "moussaka", "ramen", "bulgogi"], ["korean", "japanese", "japanese", "greek", "japanese", "korean"], [9, 12, 8, 15, 14, 7]);
foodRatings.highestRated("korean"); // return "kimchi"
                                    // "kimchi" is the highest rated korean food with a rating of 9.
foodRatings.highestRated("japanese"); // return "ramen"
                                      // "ramen" is the highest rated japanese food with a rating of 14.
foodRatings.changeRating("sushi", 16); // "sushi" now has a rating of 16.
foodRatings.highestRated("japanese"); // return "sushi"
                                      // "sushi" is the highest rated japanese food with a rating of 16.
foodRatings.changeRating("ramen", 16); // "ramen" now has a rating of 16.
foodRatings.highestRated("japanese"); // return "ramen"
                                      // Both "sushi" and "ramen" have a rating of 16.
                                      // However, "ramen" is lexicographically smaller than "sushi".
```

##### **Constraints:**

*   `1 <= n <= 2 * 10``4`
*   `n == foods.length == cuisines.length == ratings.length`
*   `1 <= foods[i].length, cuisines[i].length <= 10`
*   `foods[i]`, `cuisines[i]` consist of lowercase English letters\.
*   `1 <= ratings[i] <= 10``8`
*   All the strings in `foods` are **distinct**\.
*   `food` will be the name of a food item in the system across all calls to `changeRating`\.
*   `cuisine` will be a type of cuisine of **at least one** food item in the system across all calls to `highestRated`\.
*   At most `2 * 10``4` calls **in total** will be made to `changeRating` and `highestRated`\.

#### [Solve it on LeetCode](https://leetcode.com/problems/design-a-food-rating-system)

# Approaches

## 1\. Brute Force

#### Intuition:

In this approach, we maintain lists to track the food, cuisine, and ratings\. Every operation such as adding, removing, or finding the highest rating will require iterating through these lists\.

#### Approach:

1.  Keep a simple list of food items along with their respective cuisines and ratings\.
2.  While changing ratings, directly modify the list for that food item\.
3.  For finding the highest\-rated food in a cuisine, iterate through the full list to find the food item with the highest rating for that cuisine\.

#### Code:

Java

```java
class Food {
   String name;
   String cuisine;
   int rating;

   public Food(String name, String cuisine, int rating) {
       this.name = name;
       this.cuisine = cuisine;
       this.rating = rating;
   }
}

class FoodRatings {
   private List<Food> foodList;

   public FoodRatings(String[] foods, String[] cuisines, int[] ratings) {
       foodList = new ArrayList<>();
       for (int i = 0; i < foods.length; i++) {
           foodList.add(new Food(foods[i], cuisines[i], ratings[i]));
       }
   }

   public void changeRating(String food, int newRating) {
       for (Food item : foodList) {
           if (item.name.equals(food)) {
               item.rating = newRating;
               break;
           }
       }
   }

   public String highestRated(String cuisine) {
       String bestFood = "";
       int highestRating = Integer.MIN_VALUE;

       for (Food item : foodList) {
           if (item.cuisine.equals(cuisine) && item.rating > highestRating) {
               highestRating = item.rating;
               bestFood = item.name;
           }
       }
       return bestFood;
   }
}
```

Complexity Analysis

*   **Time Complexity:**

*   `changeRating`: O\(n\) where n is the number of foods\.
*   `highestRated`: O\(n\) for searching through the list\.

*   **Space Complexity:** O\(n\) for storing the food items\.

## 2\. HashMap with Sorting

#### Intuition:

Using HashMaps to store foods and their details allows for faster access and update\. However, for finding the highest rated food of a specific cuisine, sorting is still required, which can be optimized further\.

#### Approach:

1.  Use a HashMap to store food details, allowing O\(1\) access for updates\.
2.  Store cuisines in a HashMap with a list of foods to facilitate easy sorting for rating retrieval\.

#### Code:

Java

```java
class FoodRatings {
   private Map<String, Food> foodMap;
   private Map<String, List<Food>> cuisineMap;

   public FoodRatings(String[] foods, String[] cuisines, int[] ratings) {
       foodMap = new HashMap<>();
       cuisineMap = new HashMap<>();
       for (int i = 0; i < foods.length; i++) {
           Food food = new Food(foods[i], cuisines[i], ratings[i]);
           foodMap.put(foods[i], food);
           cuisineMap.computeIfAbsent(cuisines[i], k -> new ArrayList<>()).add(food);
       }
   }

   public void changeRating(String food, int newRating) {
       Food item = foodMap.get(food);
       if (item != null) { 
           item.rating = newRating; 
       }
   }

   public String highestRated(String cuisine) {
       List<Food> foods = cuisineMap.get(cuisine);
       if (foods == null || foods.isEmpty()) {
           return "";
       }
       Collections.sort(foods, (a, b) -> b.rating != a.rating ? Integer.compare(b.rating, a.rating) : a.name.compareTo(b.name));
       return foods.get(0).name;
   }
}
```

Complexity Analysis

*   **Time Complexity:**

*   `changeRating`: O\(1\) for direct update via HashMap\.
*   `highestRated`: O\(m log m\), where m is the number of foods for a specific cuisine\.

*   **Space Complexity:** O\(n \+ m\) where n is the number of foods and m the number of cuisines\.

## 3\. TreeMap with HashMap

#### Intuition:

Leverage the TreeMap that keeps entries sorted based on keys, which can be used to maintain a sorted order of the ratings while supporting efficient lookup for finding the highest rated meal\.

#### Approach:

1.  Utilize a HashMap for storing food ratings quickly accessible for updates\.
2.  For each cuisine, use a TreeMap with the food names as keys, which automatically maintains a sorted order of foods by rating in descending order\.
3.  Directly fetch the first entry of the TreeMap for highest\-rated food retrieval\.

#### Code:

Java

```java
class FoodRatings {
   private Map<String, String> foodToCuisine;
   private Map<String, Integer> foodToRating;
   private Map<String, TreeMap<Integer, String>> cuisineToRatings;

   public FoodRatings(String[] foods, String[] cuisines, int[] ratings) {
       foodToCuisine = new HashMap<>();
       foodToRating = new HashMap<>();
       cuisineToRatings = new HashMap<>();
       
       for (int i = 0; i < foods.length; i++) {
           String food = foods[i];
           String cuisine = cuisines[i];
           int rating = ratings[i];
           
           foodToCuisine.put(food, cuisine);
           foodToRating.put(food, rating);
           
           cuisineToRatings.putIfAbsent(cuisine, new TreeMap<>((a, b) -> b - a));
           cuisineToRatings.get(cuisine).put(rating, food);
       }
   }
   
   public void changeRating(String food, int newRating) {
       String cuisine = foodToCuisine.get(food);
       int oldRating = foodToRating.get(food);
       
       TreeMap<Integer, String> ratingsMap = cuisineToRatings.get(cuisine);
       ratingsMap.remove(oldRating);
       
       foodToRating.put(food, newRating);
       ratingsMap.put(newRating, food);
   }
   
   public String highestRated(String cuisine) {
       TreeMap<Integer, String> ratingsMap = cuisineToRatings.get(cuisine);
       return ratingsMap.firstEntry().getValue();
   }
}
```

Complexity Analysis

*   **Time Complexity:**

*   `changeRating`: O\(log m\) where m is the number of interacting foods in the same cuisine due to the TreeMap operations\.
*   `highestRated`: O\(1\), quick access to the highest rating using TreeMap\.

*   **Space Complexity:** O\(n \+ k\) where n is the number of foods and k is the space for maintaining TreeMap entries per cuisine\.