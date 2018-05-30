Feature: player play or stop the advertisements after MRT depart the station over 15 seconds

In order to play advertisements more efficiency and economically
As an advertiser
I want player to play or stop the advertisements after MRT depart the station over 15 seconds according to playList

Scenario: There are ads ready to play in playList and MRT depart over 15 seconds

    Given The player has opened and has ads in playList
    When MRT depart the station over 15 seconds
    Then The player should start to play

Scenario: There is no ad ready to play in playList and MRT depart over 15 seconds

    Given The player has opened and has no ad in playList
    When MRT depart the station over 15 seconds
    Then The player should stay stopped

Scenario: There are ads ready to play in playList and MRT depart less than 15 seconds

    Given The player has opened and has ads in playList
    When MRT depart the station less than 15 seconds
    Then The player should stay stopped

Scenario: There is no ad ready to play in playList and MRT depart less than 15 seconds

    Given The player has opened and has no ad in playList
    When MRT depart the station less than 15 seconds
    Then The player should stay stopped

