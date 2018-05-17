Feature: MRT leave the station 

Scenario: There are ads ready to play

    Given The player has opened and has ads ready to play
    When MRT leave the station over 15 seconds
    Then the player should start to play
