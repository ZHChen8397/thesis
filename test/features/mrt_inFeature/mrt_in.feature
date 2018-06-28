Feature: player pause the advertisements when train arrive the station 

In order to save on the cost of playing advertisements
As an advertiser
I want player stop playing the advertisements after MRT arrive the station

Scenario: There are advertisements ready to play in playList when train arrive the station

    Given The player has opened and has advertisements in playList 
    When Train arrive the station
    Then The player should pause the advertisements