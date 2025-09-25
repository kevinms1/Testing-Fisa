import { test, expect } from '@playwright/test';
import path from 'path'
import fs from 'fs';

 test('+-PM Verificacion caso', async ({ page }) => {
  test.setTimeout(120000);
  //const caseNumber = fs.readFileSync('caso.txt', 'utf8').trim();
  //console.log('Número de caso leído:', caseNumber);
  const caseNumber =  '00007612'; 

  await page.goto('https://fisagrp--dev02.sandbox.my.salesforce.com/');
  await page.getByRole('textbox', { name: 'Username' }).fill('kevin.melendez@fisa.ndev02');
  await page.getByRole('textbox', { name: 'Password' }).fill('Kevin123');
  await page.getByRole('button', { name: 'Log In to Sandbox' }).click();
  await page.waitForLoadState('load');
  await page.waitForTimeout(9000);
  
  //await page.getByRole('button', { name: 'Notificaciones' }).click();


  await page.goto('https://fisagrp--dev02.sandbox.lightning.force.com/lightning/r/Case/500U900000HQZj3IAH/view');
  await page.getByRole('link', { name: 'Ver todos Casos relacionados' }).click();
  await page.waitForTimeout(9000);
  await page.getByLabel(`Subfichas de ${caseNumber} | Caso`).getByRole('tab', { name: `Case ${caseNumber} | Caso` }).click();
  //await page.locator('#brandBand_3 a').filter({ hasText: 'Cerrado' }).click();
  
  await page.locator('a').filter({ hasText: 'Cerrado' }).click();

  await page.locator('button').filter({ hasText: 'Seleccionar Estado cerrada/o' }).click();
  await page.getByLabel('Estado*').selectOption('Cerrado');

  
  await page.getByRole('button', { name: 'Guardar' }).click();
  
  expect(page.locator('.slds-theme--error'));
  await page.waitForTimeout(4000);
  await page.getByRole('button', { name: 'Mostrar acciones', exact: true }).click();
  await page.getByRole('menuitem', { name: 'Eliminar' }).click();
  await page.getByRole('button', { name: 'Eliminar' }).click();
  await page.locator('a').filter({ hasText: 'Cerrado' }).click();
  await page.locator('button').filter({ hasText: 'Seleccionar Estado cerrada/o' }).click();
  await page.getByLabel('Estado*').selectOption('Cerrado');
  await page.getByRole('button', { name: 'Guardar' }).selectOption('Cerrado');
  await page.getByLabel('Estado*').click();
  await page.getByRole('button', { name: 'Guardar' }).click();
  await page.getByText('Estado cambió correctamente.', { exact: true }).click();

});