import { test, expect } from '@playwright/test';
import path from 'path'
import fs from 'fs';

test('crea caso cliente comunidad', async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto('https://fisagrp--dev02.sandbox.my.site.com/servicios/s/');
  await page.getByRole('textbox', { name: 'Nombre de usuario' }).click();
  await page.getByRole('textbox', { name: 'Nombre de usuario' }).fill('jenifer.maltez@intellectsystem.net.dev02cliente');
  await page.getByRole('textbox', { name: 'Contraseña' }).click();
  await page.getByRole('textbox', { name: 'Contraseña' }).fill('Fisa2025..');
  await page.getByRole('button', { name: 'Iniciar Sesión' }).click();
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

 

 test('PM Verificacion caso', async ({ page }) => {
  test.setTimeout(120000);
  const caseNumber = fs.readFileSync('caso.txt', 'utf8').trim();
  console.log('Número de caso leído:', caseNumber);

  await page.goto('https://fisagrp--dev02.sandbox.my.salesforce.com/');
  await page.getByRole('textbox', { name: 'Username' }).fill('kevin.melendez@fisa.ndev02');
  await page.getByRole('textbox', { name: 'Password' }).fill('Kevin123');
  await page.getByRole('button', { name: 'Log In to Sandbox' }).click();
  await page.waitForLoadState('load');
  await page.waitForTimeout(9000);
  
  await page.getByRole('button', { name: 'Notificaciones' }).click();
  await page.getByRole('link', { name: `Nuevo Caso Tienes Asignado un nuevo Caso, favor dar seguimiento: ${caseNumber} hace` }).click();
  await page.waitForTimeout(4000);

  await page.getByRole('button', { name: 'Modificar Sub Módulo' }).click();
 await page.waitForTimeout(1000);
 await page.getByRole('combobox', { name: 'Sub Módulo' }).click();
 await page.getByRole('option', { name: 'Clientes (Módulo 2)' }).locator('span').nth(1).click();
 await page.locator('button[name="SaveEdit"]').click();
  
  await page.waitForLoadState('load');
  //const spinner = page.getByRole('main').locator('div').filter({ hasText: /^Cargando\.\.\.$/ }).first();
  const spinner = page.locator('div.spinnerWrapper.forceComponentSpinner');
  await spinner.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
  await spinner.waitFor({ state: 'hidden', timeout: 80000 });

  //await page.waitForTimeout(15000);
  
  await page.getByRole('combobox', { name: '*Elige un Proyecto' }).click();
  await page.getByRole('combobox', { name: '*Elige un Proyecto' }).fill('pro');
  await page.getByRole('option', { name: 'Proyecto Prueba' }).locator('span').nth(2).click();
  await page.getByRole('button', { name: 'Guardar' }).click();
 
  await page.getByRole('button', { name: 'Más Fichas' }).click();
  await page.getByRole('menuitem', { name: 'PS' }).click();
  await page.getByRole('button', { name: 'Modificar Tipo de' }).click();
  await page.getByRole('combobox', { name: 'Tipo de Requerimiento' }).click();
  //await page.getByText('Tiempo y Materiales', { exact: true }).click();
  await page.getByTitle('Tiempo y Materiales').click();
  await page.locator('button[name="SaveEdit"]').click();
  await spinner.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
  await spinner.waitFor({ state: 'hidden', timeout: 80000 });
  await page.getByRole('main').locator('div').filter({ hasText: /^Cargando\.\.\.$/ }).first().waitFor({ state: 'detached' });
  await page.waitForTimeout(6000);

  await page.getByRole('button', { name: 'Más Fichas' }).click();
  await page.getByRole('menuitem', { name: 'PS' }).click();

  
  //await expect(page.locator('#tab-17')).toContainText('Propuesta de Servicio');
  await page.getByRole('button', { name: 'Modificar Días aprobación' }).click();
  await page.getByRole('textbox', { name: 'Días aprobación Propuesta de' }).fill('2');
  await page.locator('button[name="SaveEdit"]').click();
  const spinner1 = page.locator('div.spinnerWrapper.forceComponentSpinner');
  await spinner1.waitFor({ state: 'hidden', timeout: 60000 });
  //await page.getByRole('main').locator('div').filter({ hasText: /^Cargando\.\.\.$/ }).first().waitFor({ state: 'detached' });
  await page.waitForTimeout(10000);
  
  await page.getByRole('button', { name: 'Más Fichas' }).click();
  await page.getByRole('menuitem', { name: 'Noticias en tiempo real' }).click();
  //await page.getByText('Noticias en tiempo real' ).click();


  await page.getByTitle('Compartir una actualización...').click();
  await page.getByLabel('Compartir una actualización...').fill('comparto la propuesta de servicio');

  page.locator('button').filter({ hasText: 'Adjunte hasta 10 archivos' }).click();
  const [fileChooser2] = await Promise.all([
  page.waitForEvent('filechooser'),
  page.getByRole('button', { name: 'Cargar archivos' }).click()
   ]);
// Carga el archivo
  await fileChooser2.setFiles('C:/Users/USUARIO/OneDrive/Escritorio/Testing Fisa/files/camion.png');
  
  await page.locator('a').filter({ hasText: 'Únicamente FISA Group' }).click();
  await page.getByText('Todos los que tengan acceso', { exact: true }).click();
  await page.getByTitle('Haga clic o pulse Ctrl+Intro').click();
  await page.getByRole('button', { name: 'Más Fichas' }).click();
  await page.getByRole('menuitem', { name: 'PS' }).click();
  await page.getByRole('button', { name: 'Modificar Envío notificación' }).click();
  await page.getByRole('checkbox', { name: 'Envío notificación PS' }).check();
  await page.locator('button[name="SaveEdit"]').click();
 });


test('Comunidad: Verificación propuesta de servicio', async ({ page }) => {
  const caseNumber = fs.readFileSync('caso.txt', 'utf8').trim();
  console.log('Número de caso leído:', caseNumber);
  test.setTimeout(90000);

  await page.goto('https://fisagrp--dev02.sandbox.my.site.com/servicios/s/');    
  await page.getByRole('textbox', { name: 'Nombre de usuario' }).fill('jenifer.maltez@intellectsystem.net.dev02cliente');
  await page.getByRole('textbox', { name: 'Contraseña' }).fill('Fisa2025..');
  await page.getByRole('button', { name: 'Iniciar Sesión' }).click();
  await page.getByRole('button', { name: 'Notificaciones' }).click();
  await page.getByRole('link', { name: `Tienes una nueva Notificacion pendiente por responder del caso No. ${caseNumber} Se` }).click();
  await page.getByText('Seleccione una Opción' ).click();

  await page.getByText('No', { exact: true }).click();
  await page.getByText('Seleccione una Motivo' ).click();
  await page.getByText('No resolvió lo reportado').click();
  //await page.getByLabel('Comentario', { exact: true }).click();
  await page.getByLabel('Comentario').fill('todo mal');
  await page.getByText('Guardar').click();
  await page.waitForTimeout(6000);
  //await page.goto('https://fisagrp--dev02.sandbox.my.site.com/servicios/s/case/500U900000HE0pbIAD/testaut-oo2');
  expect(page.locator('records-highlights2')).toContainText('Dado de Baja');  

});


   test('PM negativ 2 fin', async ({ page }) => {
  test.setTimeout(100000);
  const caseNumber = fs.readFileSync('caso.txt', 'utf8').trim();
  console.log('Número de caso leído:', caseNumber);

  await page.goto('https://fisagrp--dev02.sandbox.my.salesforce.com/');
  await page.getByRole('textbox', { name: 'Username' }).fill('kevin.melendez@fisa.ndev02');
  await page.getByRole('textbox', { name: 'Password' }).fill('Kevin123');
  await page.getByRole('button', { name: 'Log In to Sandbox' }).click();
  await page.waitForLoadState('load');
  await page.waitForTimeout(9000);

  await page.getByRole('button', { name: 'Notificaciones' }).click();
  await page.getByRole('link', { name: `EL CLIENTE RECHAZO EL ANALISIS PREVIO ${caseNumber}` }).click();
  await page.locator('a').filter({ hasText: 'Dado de Baja' }).click();
  expect(page.locator('records-highlights-details-item').filter({ hasText: 'Dado de BajaEstado' }).locator('lightning-formatted-text'));
  //await expect(page.getByText('Dado de Baja')).toBeVisible();
});
   
   