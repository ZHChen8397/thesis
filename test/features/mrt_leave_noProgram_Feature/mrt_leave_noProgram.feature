Feature: MRT leave the station with no program test

Background:
    Given the player has opened

Scenario: There is no program in CMS

    Given User has no program in CMS
    When MRT leave the station over 15 seconds
    Then the player should stay stopped