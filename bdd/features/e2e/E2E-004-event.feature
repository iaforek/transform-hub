Feature: Event e2e tests

    #added to ignore because this scenario is based on host-one
    @ignore
    Scenario: E2E-004 TC-001 Send test-event through API and get event emitted by sequence
        Given host one execute sequence in background "../packages/reference-apps/event-sequence.tar.gz"
        And host one process is working
        #potentially condition race issue TODO verify
        And wait "3000" ms
        When send event "test-event" to sequence with message "test message"
        Then get event from sequence
        And host one process is stopped
        And response body is "{\"eventName\":\"test-event-response\",\"message\":\"message from sequence\"}"

    Scenario: E2E-004 TC-002 Send test-event through API and get event emitted by sequence
        Given host started
        And host process is working
        When sequence "../packages/reference-apps/event-sequence.tar.gz" loaded
        And wait for "6000" ms
        Then instance started with arguments "20"
        And wait for "4000" ms
        When get instance health
        And get containerId
        Then instance health is "true"
        When send event "test-event" to instance with message "test message"
        And wait for "5000" ms
        Then get event from instance
        And wait for "3000" ms
        Then instance response body is "{\"eventName\":\"test-event-response\",\"message\":\"message from sequence\"}"
        And wait for "10000" ms
        # Then instance is stopped/killed
        And container is closed
        Then host stops
