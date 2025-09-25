import { test, expect } from '@playwright/test';
import path from 'path'
import fs from 'fs';

test('crea caso cliente comunidad', async ({ page }) => {
  test.setTimeout(90000);

  await page.goto('/');

  await page.getByRole('menuitem', { name: 'Crear Caso' }).click();
  await page.getByRole('combobox', { name: 'Seleccione el Tipo de Caso' }).click();
  await page.getByText('Requerimiento').click();
  await page.getByRole('combobox', { name: 'Seleccione un Producto' }).click();
  await page.getByRole('option', { name: 'FISA System' }).locator('span').nth(1).click();
  await page.getByRole('combobox', { name: 'Seleccione un Módulo' }).click();
  await page.getByRole('option', { name: 'Núcleo del Sistema' }).click();
  await page.getByRole('textbox', { name: 'Asunto de Caso' }).click();
  await page.getByRole('textbox', { name: 'Asunto de Caso' }).fill('Test_aut oo2');
  await page.locator('.slds-rich-text-area__content').click();
  await page.getByRole('textbox', { name: 'Descripción' }).fill('Descript text');
  
  //File chooser 
  const fileChooserPromise1 = page.waitForEvent('filechooser');
   await page.getByText('Cargar archivos').click();
  //Set file to be uploaded
   const fileChooser = await fileChooserPromise1;
   await fileChooser.setFiles(path.join(__dirname, '../files/camion.png'));
  
  await page.getByRole('button', { name: 'Listo' }).click();
  await page.getByRole('button', { name: 'Crear Caso' }).click();
  await page.waitForTimeout(8000);
  
  const caseNumberText = await page.locator('lightning-formatted-text').first().textContent();
  const match = caseNumberText?.match(/\d{8}/);
  const caseNumber = match ? match[0] : '';
  console.log('Número de caso: ', caseNumber);

  fs.writeFileSync('caso.txt', caseNumber || '');
  await page.waitForTimeout(8000);
  await expect(page.locator('records-highlights2')).toBeVisible();

 });

 test('Comunidad: Verificación propuesta de servicio', async ({ page }) => {
   const caseNumber = fs.readFileSync('caso.txt', 'utf8').trim();
   console.log('Número de caso leído:', caseNumber);
 
   await page.goto('https://fisagrp--dev02.sandbox.my.site.com/servicios/s/');    
   await page.getByRole('textbox', { name: 'Nombre de usuario' }).fill('jenifer.maltez@intellectsystem.net.dev02cliente');
   await page.getByRole('textbox', { name: 'Contraseña' }).fill('Fisa2025..');
   await page.getByRole('button', { name: 'Iniciar Sesión' }).click();
   await page.getByRole('button', { name: 'Notificaciones' }).click();
   await page.getByRole('link', { name: `Tienes una nueva Notificacion pendiente por responder del caso No. ${caseNumber} Se` }).click();
   await page.getByText('Seleccione una Opción' ).click();
 
   await page.locator('span').filter({ hasText: 'Si' }).first().click();
   await page.getByText('Guardar').click();
   await page.waitForTimeout(6000);
 
   await expect(page.locator('records-highlights2')).toContainText('En Planificación');
  });