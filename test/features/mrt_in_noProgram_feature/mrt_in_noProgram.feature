Feature: MRT enter the station 

Scenario: There is no ad ready to play in playList when MRT enter the station

    Given The player has opened and has no ad in playList
    When MRT enter the station
    Then The player should stay stopped
