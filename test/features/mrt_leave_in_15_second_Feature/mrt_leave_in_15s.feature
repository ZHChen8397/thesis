Feature: MRT leave the station less than 15 seconds 

Background:
    Given the player has opened

Scenario: There are ads ready to play

    Given the player already has ads playing
    When MRT leave the station less than 15 seconds
    Then the player should stay stopped

Scenario: There is no ad to play

    Given the player has no ad to play
    When MRT leave the station less than 15 seconds
    Then the player should stay stopped

