from __future__ import annotations

from typing import Any

import security_filter

try:
    from playwright.async_api import async_playwright
except Exception:  # pragma: no cover - import depends on installed package
    async_playwright = None


async def harvest_job_listings(target_url: str) -> list[dict[str, Any]]:
    if async_playwright is None:
        raise RuntimeError("Playwright is not installed in this environment")

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.goto(target_url)
        await page.wait_for_timeout(3000)

        scraped_jobs: list[dict[str, Any]] = []
        job_cards = await page.query_selector_all(".job-card-container")

        for card in job_cards:
            title_element = await card.query_selector(".job-title")
            company_element = await card.query_selector(".company-name")
            desc_element = await card.query_selector(".job-summary")
            link_element = await card.query_selector("a[href]")

            if title_element and company_element and desc_element:
                title = await title_element.inner_text()
                company = await company_element.inner_text()
                description = await desc_element.inner_text()
                application_link = await link_element.get_attribute("href") if link_element else None

                status = security_filter.evaluate_listing_security(company, description)
                scraped_jobs.append(
                    {
                        "company_name": company.strip(),
                        "job_title": title.strip(),
                        "job_description": description.strip(),
                        "application_link": application_link,
                        "status": status,
                    }
                )

        await browser.close()
        return scraped_jobs