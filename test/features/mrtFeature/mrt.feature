@step=mrt
Feature: cam in js

Scenario: JS call python script

    Given I run my python code
    When I finish the camera
    Then I should return value gotcha