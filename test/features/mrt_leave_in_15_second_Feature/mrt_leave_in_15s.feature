Feature: MRT leave the station less than 15 seconds test

Background:
    Given the player has opened

Scenario: There is a program in CMS

    Given User already push a program to CMS
    When MRT leave the station less than 15 seconds
    Then the player should stay stopped

Scenario: There is no program in CMS

    Given User has no program in CMS
    When MRT leave the station less than 15 seconds
    Then the player should stay stopped

