Feature: MRT enter the station

Scenario: There are ads ready to play

    Given The player has opened and already has ads playing 
    When MRT is enter the station
    Then the player should stop the ads

