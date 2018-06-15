Feature:  player play the advertisements or stay stopped after MRT depart the station over 15 seconds

In order to play advertisements more efficiency and economically
As an advertiser
I want player to play the advertisements or stay stopped after MRT depart the station over 15 seconds according to playlist


Scenario: There are advertisments ready to play in playList and MRT depart over 15 seconds

    Given The player has opened and has advertisements in playList
    When MRT depart the station over 15 seconds
    Then The player should start to play