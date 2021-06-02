Feature: Start multiple instances

    Scenario: PT-003 TC-001 More than 5 instances work for long time
        Given host started
        And wait for "2000" ms
        When starts at least 2 sequences "../packages/reference-apps/durability-preservation.tar.gz" for .25 hours
        When wait for .1 hours
        Then check if instances respond
        Then host stops

    Scenario: PT-003 TC-002 More than 25 instances work for long time
        Given host started
        And wait for "2000" ms
        When starts at least 25 sequences "../packages/reference-apps/durability-preservation.tar.gz" for 2 hours
        When wait for 1 hours
        Then check if instances respond
        Then host stops

    Scenario: PT-003 TC-003 More than 25 instances work for long time
        Given host started
        And wait for "2000" ms
        When starts at least 25 sequences "../packages/reference-apps/durability-preservation.tar.gz" for 25 hours
        When wait for 24 hours
        Then check if instances respond
        Then host stops


