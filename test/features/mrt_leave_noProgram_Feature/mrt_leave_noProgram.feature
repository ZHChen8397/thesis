Feature: player play or stop the advertisements after MRT depart the station over 15 seconds

Scenario: There is no advertisment ready to play in playList and MRT depart over 15 seconds

    Given The player has opened and has no advertisement in playList
    When MRT depart the station over 15 seconds
    Then The player should stay stopped
