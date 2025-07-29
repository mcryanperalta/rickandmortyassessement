<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use App\Service\RickAndMortyServices;
use Symfony\Component\HttpFoundation\Request;

class RickAndMortyCharacterApiAction extends AbstractController
{
    public function __construct(
        private RickAndMortyServices $rickAndMortyService

    ) {}

    #[Route('/api/characters/all', name: 'api_character_list', methods: ['GET'])]
    public function list(Request $request): JsonResponse
    {
        $page = (int)$request->get('page') ?? 1;
        $characters = $this->rickAndMortyService->loadAllCharacters($page);

        return $this->json($characters);
    }

    #[Route('/api/character/{id}', name: 'api_character_show', methods: ['GET'])]
    public function show($id): JsonResponse
    {
        $character = $this->rickAndMortyService->loadCharacter($id);
        $dimension = '';
        if($character->location){
            $location = $this->rickAndMortyService->loadLocation((int)basename($character->location->url));
            if($location){
                $dimension = $location->dimension;
            }
        }
        $episode = $character->episode;
        $episodeIds = [];
        foreach ($episode as $key => $value) {
            $episodeIds[] =  basename($value);
        }
        
        return $this->json(['character' => $character,'episodeIds' => $episodeIds,'dimension' =>$dimension]);
    }

    #[Route('/api/characters/get-by-ids', name: 'api_characters_show_ids', methods: ['POST'])]
    public function getByIds(Request $request): JsonResponse
    {
        $characterIds = $request->getContent();
        $characterIds = json_decode($characterIds,true);
        $characters = $this->rickAndMortyService->loadCharactersById($characterIds['characters']);

        return $this->json($characters);
    }
}
