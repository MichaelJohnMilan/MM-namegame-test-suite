import {
    Selector,
    t
} from "testcafe";

export class BasePage {

    baseUrl = 'http://www.ericrochester.com/name-game/';

    title = Selector(".header")
    photo = Selector(".photo")
    attempts = Selector(".attempts")
    correct = Selector(".correct")
    streak = Selector(".streak")
    name = Selector(".name")
    whois = Selector("#name")

    async selectPhoto(number) {
        await t
            .click(Selector(this.photo).nth(number));
    }

    async getCorrectSelection() {
        const whoisAttributes = await this.whois.attributes;
        return Number(whoisAttributes['data-n']);

    }
    async waitForPageLoad() {
        await this.photo.visible;
    }

    async getIncorrectSelection(correctSelection) {
        return correctSelection === 4 ? -1 : 1
    }

    async waitForNextRound() {
        const initialWhoIs = await this.whois.textContent;

        for (var i = 0; i < 5; i++) {
            const currentWhoIs = await this.whois.textContent;

            if (initialWhoIs === currentWhoIs) {
                await t
                    .expect(i)
                    .notEql(4, 'Next round not loading');

                await t
                    .wait(1000);

            } else if (initialWhoIs !== currentWhoIs) {
                i = 5;
            };
        }
    }
    async getImageScources() {
        var photoSources = [];

        for (var i = 0; i < 5; i++) {
            var imageSourceAttributes = await Selector(this.photo).nth(i).child('img').attributes;
            var imageSource = imageSourceAttributes.src;

            await photoSources.push(imageSource);
        }
        return photoSources;
    }
}