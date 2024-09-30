import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Search Gyms (e2e)', () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it('Should be able to search gyms byu title', async () => {
        const { token } = await createAndAuthenticateUser(app, true);

        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'JavaScript Gym',
                description: 'JavaScript Gym Description',
                phone: '(19)9999999',
                latitude: -22.7672064,
                longitude: -47.4054656,
            });

        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'TypesSrcipt Gym',
                description: 'JavaScript Gym Description',
                phone: '(19)9999999',
                latitude: -22.7672064,
                longitude: -47.4054656,
            });

        const response = await request(app.server)
            .get('/gyms/search')
            .query({
                q: 'JavaScript',
                page: 1,
            })
            .set('Authorization', `Bearer ${token}`)
            .send();

        expect(response.statusCode).toEqual(200);
        expect(response.body.gyms).toHaveLength(1);
        expect(response.body.gyms).toEqual([
            expect.objectContaining({
                title: 'JavaScript Gym',
            }),
        ]);
    });
});
