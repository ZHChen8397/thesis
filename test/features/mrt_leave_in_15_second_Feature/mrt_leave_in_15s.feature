Feature: MRT leave the station less than 15 seconds 

Background:
    Given the player has opened

Scenario: There are ads ready to play in playList and MRT leave less than 15 seconds

    Given The player has opened and has ads in playList
    When MRT leave the station less than 15 seconds
    Then The player should stay stopped

Scenario: There is no ad ready to play in playList and MRT leave less than 15 seconds

    Given The player has opened and has no ad in playList
    When MRT leave the station less than 15 seconds
    Then The player should stay stopped


