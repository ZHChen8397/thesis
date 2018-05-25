Feature: player play the advertisements or not when MRT leave the station 

In order to play advertisements more efficiency and economically
As an advertiser
I want player control playing the advertisements or not after MRT leave the station according to playList

Scenario: There are ads ready to play in playList and MRT leave over 15 seconds

    Given The player has opened and has ads in playList
    When MRT leave the station over 15 seconds
    Then The player should start to play

Scenario: There is no ad ready to play in playList and MRT leave over 15 seconds

    Given The player has opened and has no ad in playList
    When MRT leave the station over 15 seconds
    Then The player should stay stopped

Scenario: There are ads ready to play in playList and MRT leave less than 15 seconds

    Given The player has opened and has ads in playList
    When MRT leave the station less than 15 seconds
    Then The player should stay stopped

Scenario: There is no ad ready to play in playList and MRT leave less than 15 seconds

    Given The player has opened and has no ad in playList
    When MRT leave the station less than 15 seconds
    Then The player should stay stopped

