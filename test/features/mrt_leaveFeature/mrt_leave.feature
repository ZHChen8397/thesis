Feature: MRT leave the station test

Background:
    Given the player has opened

Scenario: There is a program in CMS

    Given User already push a program to CMS
    When MRT leave the station over 15 seconds
    Then the player should start playing program
