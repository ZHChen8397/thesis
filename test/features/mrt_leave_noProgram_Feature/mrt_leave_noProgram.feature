Feature: player play or pause the advertisements after train depart the station over 15 seconds

Scenario: There is no advertisement ready to play in playList and train depart over 15 seconds

    Given The player has opened and has no advertisement in playList and train is in station
    When Train depart the station over 15 seconds
    Then The player should stay paused
