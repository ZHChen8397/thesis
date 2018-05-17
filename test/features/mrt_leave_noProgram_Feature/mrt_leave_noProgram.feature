Feature: MRT leave the station 

Scenario: There is no ad to play

    Given the player has opened and has no ad to play
    When MRT leave the station over 15 seconds
    Then the player should stay stopped