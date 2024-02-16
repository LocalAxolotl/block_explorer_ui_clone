import { test, expect } from "@playwright/test";
import { Navbar } from "../support/pages/navbar";
import { BlockPage } from "../support/pages/blockPage";
import { AccountPage } from "../support/pages/accountPage";

test.describe("Navbar tests", () => {
  let navbar: Navbar;
  let blockPage: BlockPage;

  test.beforeEach(async ({ page }) => {
    navbar = new Navbar(page);
    blockPage = new BlockPage(page);
  });

  test("navbar of block explorer is loaded", async ({ page }) => {
    await navbar.gotoBlockExplorerPage();
    await expect(navbar.navBarElement).toBeVisible();
    await expect(navbar.navBarHiveLogo).toBeVisible();
    await expect(navbar.navBarHiveHeaderText).toHaveText("Hive Block Explorer");
    await expect(navbar.navBarWitnessesLink).toHaveText("Witnesses");
    await expect(navbar.navBarJsonRowToggle).toHaveText("Raw Json view");
    await expect(navbar.searchBarInput).toHaveAttribute("placeholder", "Search user, block, transaction");
  });

  test("search for the specific block number and move to the block page", async ({ page }) => {
    // Used in test: Block Number 82856172, Producer gtg
    const blockNumber: string = '82856172';
    const producerName: string = 'gtg';
    await navbar.gotoBlockExplorerPage();
    await navbar.searchBarInput.fill(blockNumber);
    await navbar.navBarSearchConntentLink.first().click();
    await blockPage.validateBlockPageIsLoaded();
    await blockPage.validateBlockNumber(blockNumber);
    await blockPage.validateBlockProducerName(producerName);
  });

  test("search for the specific user name and move to the account page", async ({ page }) => {
    // search for gtg user
    let accountPage = new AccountPage(page);
    const userName: string = 'gtg';

    await navbar.gotoBlockExplorerPage();
    await navbar.searchBarInput.fill(userName);
    await navbar.navBarSearchConntentLink.first().click();
    await accountPage.validateAccountPageIsLoaded();
    await accountPage.validateAccountName(userName);
  });

  test("search for the specific transaction number and move to the transaction page", async ({ page }) => {
    // Full hash of the transaction needed

  });

});
