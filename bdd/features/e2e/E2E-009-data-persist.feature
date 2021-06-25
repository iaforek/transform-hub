Feature: Output streams persisting data E2E test

    @ci
    Scenario: E2E-009 TC-001 Get stdout, stderr, output streams from Sequence which generates random numbers, check if all were recived.
        Given host is running
        And sequence "../packages/reference-apps/output-streams.tar.gz" loaded
        And wait for "2000" ms
        And instance started with arguments "1000"
        And wait for "20000" ms
        And keep instance streams "stdout,stderr,output"
        And get instance health
        And get containerId
        And instance health is "true"
        And wait for "10000" ms
        When send kill message to instance
        And wait for "5000" ms
        And container is closed
        Then host is running
        And kept instance stream "stdout" should store 1000 items divided by ","
        And kept instance stream "stderr" should store 1000 items divided by ","
        And kept instance stream "output" should store 1000 items divided by ","
        