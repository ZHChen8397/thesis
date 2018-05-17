Feature: MRT enter the station 

Scenario: There is no ad to play

    Given the player has opened and has no ad to play
    When MRT is enter the station
    Then the player should stay stopped