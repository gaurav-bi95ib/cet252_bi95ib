import { Selector } from 'testcafe';

fixture`Game Review Client Tests`
    .page`http://localhost:3001/`;

test('Page loads and displays title', async t => {
    const headerTitle = Selector('.app-header h1');
    await t
        .expect(headerTitle.innerText).eql('Game Reviews');
});

test('Full CRUD Flow: Create, Edit, and Delete Game Review', async t => {
    // -------------------------------------------------------------
    // CREATE
    // -------------------------------------------------------------
    await t
        .typeText('#title', 'TestCafe UI Game')
        .typeText('#genre', 'Testing')
        .typeText('#platform', 'Automated')
        .typeText('#rating', '9')
        .typeText('#review', 'This game was created by TestCafe automation to test CRUD.')
        .click('#submit-btn');

    // Assert the card was created and exists on the grid
    const createdCard = Selector('.game-card').withText('TestCafe UI Game');
    await t.expect(createdCard.exists).ok('The new game card should appear in the UI');

    // -------------------------------------------------------------
    // EDIT
    // -------------------------------------------------------------
    const editBtn = createdCard.find('.btn-edit');
    await t.click(editBtn);

    // Assert that the form changed into Edit Mode
    await t.expect(Selector('#form-title').innerText).eql('Edit Game Review');

    // Update the title and submit
    await t
        .selectText('#title').pressKey('delete') // Clear the field
        .typeText('#title', 'Updated UI Game')
        .click('#submit-btn');

    // Assert the old card is gone, and the new updated card exists
    await t.expect(Selector('.game-card').withText('TestCafe UI Game').exists).notOk('Old card title should not exist');
    const updatedCard = Selector('.game-card').withText('Updated UI Game');
    await t.expect(updatedCard.exists).ok('The updated game card should appear in the UI');

    // -------------------------------------------------------------
    // DELETE
    // -------------------------------------------------------------
    // Setup TestCafe to automatically click "OK" on the Javascript confirm() popup
    await t.setNativeDialogHandler(() => true);

    const deleteBtn = updatedCard.find('.btn-danger');
    await t.click(deleteBtn);

    // Assert the card no longer exists
    await t.expect(Selector('.game-card').withText('Updated UI Game').exists).notOk('The card should be completely deleted');
});
