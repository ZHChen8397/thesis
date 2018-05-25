Feature: MRT leave the station 

Scenario: There is no ad ready to play in playList and MRT  leave over 15 seconds

    Given The player has opened and has no ad in playList
    When MRT leave the station over 15 seconds
    Then The player should stay stopped