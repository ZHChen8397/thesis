Feature: player pause the advertisements when train arrive the station 

In order to save on the cost of playing advertisments
As an advertiser
I want player stop playing the advertisements after MRT arrive the station

Scenario: There is no advertisement ready to play in playList when train arrive the station

    Given The player has opened and has no advertisement in playList
    When Train arrive the station
    Then The player should stay paused
