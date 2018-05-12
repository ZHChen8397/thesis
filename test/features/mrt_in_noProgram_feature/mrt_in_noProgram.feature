Feature: MRT enter the station with no program test

Background:
    Given the player has opened
Scenario: There is no program in CMS

    Given User has no program in CMS
    When MRT is enter the station
    Then the player should stay stopped