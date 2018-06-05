Feature: player stop playing the advertisements when MRT depart the station less than 15 seconds

In order to save on the cost of playing ads 
As an advertiser
I want player stay stopped when MRT depart the station less than 15 seconds

Scenario: There are ads ready to play in playList and MRT depart less than 15 seconds

    Given The player has opened and has ads in playList
    When MRT depart the station less than 15 seconds
    Then The player should stay stopped