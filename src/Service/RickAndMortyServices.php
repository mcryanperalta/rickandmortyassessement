<?php

namespace App\Service;

use Symfony\Contracts\HttpClient\HttpClientInterface;
use NickBeen\RickAndMortyPhpApi\Api;
use NickBeen\RickAndMortyPhpApi\Character;
use NickBeen\RickAndMortyPhpApi\Episode;
use NickBeen\RickAndMortyPhpApi\Location;

class RickAndMortyServices
{
    
    private Character   $characterApi;
    private Episode     $episodeApi;
    private Location    $locationApi;
    public function __construct() {
        $this->characterApi = new Character();
        $this->episodeApi = new Episode();
        $this->locationApi = new Location();
    }


    public function loadAllCharacters(int $page = 1) {
        $response = $this->characterApi->page($page)->get();
        return $response;
    }

    public function loadAllEpisodes(int $page = 1) {
        $response = $this->episodeApi->page($page)->get();
        return $response;
    }

    public function loadAllLocations(int $page = 1) {
        $response = $this->locationApi->page($page)->get();
        return $response;
    }
    
    public function loadCharacter(int $ch = 1) {
        $response = $this->characterApi->get($ch);
        return $response;
    }

    public function loadCharactersById(array $chs) {
        $chs = array_map('intval', $chs);
        $response = $this->characterApi->get(...$chs);
        return $response;
    }

    public function loadEpisode(int $ep = 1) {
        $response = $this->episodeApi->get($ep);
        return $response;
    }

    public function loadEpisodesById(array $eps) {
        $eps = array_map('intval', $eps);
        $response = $this->episodeApi->get(...$eps);
        return $response;
    }

    public function loadLocation(int $location = 1) {
        $response = $this->locationApi->get($location);
        return $response;
    }

    public function loadDetailsByDimension(string $dimension = '') {
        $response = $this->locationApi->withDimension($dimension)->get();
        return $response;
    }

}

