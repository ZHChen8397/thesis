Feature: player stop the advertisements when MRT arrive the station 

In order to save on the cost of playing ads
As an advertiser
I want player stop playing the advertisements after MRT arrive the station

Scenario: There is no ad ready to play in playList when MRT arrive the station

    Given The player has opened and has no ad in playList
    When MRT arrive the station
    Then The player should stay stopped
