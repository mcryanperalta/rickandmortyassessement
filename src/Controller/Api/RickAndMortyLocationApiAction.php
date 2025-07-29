<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use App\Service\RickAndMortyServices;
use Symfony\Component\HttpFoundation\Request;

class RickAndMortyLocationApiAction extends AbstractController
{
    public function __construct(
        private RickAndMortyServices $rickAndMortyService

    ) {}

    #[Route('/api/locations/all', name: 'api_location_list', methods: ['GET'])]
    public function list(Request $request): JsonResponse
    {
        $page = (int)$request->get('page') ?? 1;
        $characters = $this->rickAndMortyService->loadAllLocations($page);

        return $this->json($characters);
    }

    #[Route('/api/location/{id}', name: 'api_location_show', methods: ['GET'])]
    public function show(Request $request,$id): JsonResponse
    {
        $location = $this->rickAndMortyService->loadLocation($id);
        $characters = $location->residents;
        $characterIds = [];
        foreach ($characters as $key => $value) {
            $characterIds[] =  basename($value);
        }
        
        return $this->json(['location' => $location,'characterIds' => $characterIds]);
      
    }

    #[Route('/api/dimensions', name: 'rick_and_morty_api_dimension_search')]
    public function dimensions(Request $request): JsonResponse
    {   
        $search = $request->get('search');
        $locations = $this->rickAndMortyService->loadDetailsByDimension($search);
        $characterIds = [];
        foreach ($locations->results as $key => $location) {
            $characters = $location->residents;
            
            foreach ($characters as $key => $value) {
                $characterIds[] =  basename($value);
            }
        }
        
        return $this->json(['locations'=> $locations,'search'=>$search, 'characterIds' => $characterIds]);
    }
}
