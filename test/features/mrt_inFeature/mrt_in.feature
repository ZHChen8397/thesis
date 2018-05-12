Feature: MRT enter the station test

Background:
    Given the player has opened

Scenario: There is a program in CMS

    Given User already push a program to CMS  
    When MRT is enter the station
    Then the player should stop the program

