package fr.polytech.info4.service;

import fr.polytech.info4.service.dto.RestaurantDTO;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link fr.polytech.info4.domain.Restaurant}.
 */
public interface RestaurantService {
    /**
     * Save a restaurant.
     *
     * @param restaurantDTO the entity to save.
     * @return the persisted entity.
     */
    RestaurantDTO save(RestaurantDTO restaurantDTO);

    /**
     * Partially updates a restaurant.
     *
     * @param restaurantDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<RestaurantDTO> partialUpdate(RestaurantDTO restaurantDTO);

    /**
     * Get all the restaurants.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<RestaurantDTO> findAll(Pageable pageable);

    /**
     * Get the "id" restaurant.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<RestaurantDTO> findOne(Long id);

    /**
     * Delete the "id" restaurant.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
