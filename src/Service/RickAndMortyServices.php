<?php

namespace App\Service;

use Symfony\Contracts\HttpClient\HttpClientInterface;
use RickAndMortyPHP\RickAndMorty;

class RickAndMortyServices
{
    public function __construct(
        private RickAndMorty $api

    ) {}


    public function loadAllCharacters() {
        $response = $this->httpClient->request('GET', 'https://rickandmortyapi.com/api/character');

        return $response->toArray();
    }

}

