Feature: player stop the advertisements when MRT enter the station 

In order to save on the cost of playing ads
As an advertiser
I want player stop playing the advertisements after MRT enter the station whenever there are ads or not in playList

Scenario: There are ads ready to play in playList when MRT enter the station

    Given The player has opened and has ads in playList 
    When MRT enter the station
    Then The player should stop the ads

Scenario: There is no ad ready to play in playList when MRT enter the station

    Given The player has opened and has no ad in playList
    When MRT enter the station
    Then The player should stay stopped
